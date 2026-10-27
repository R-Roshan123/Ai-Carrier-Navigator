import { randomUUID } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import multer from 'multer';

const serverDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const uploadRoot = process.env.UPLOAD_DIR ? path.resolve(process.env.UPLOAD_DIR) : path.join(serverDir, 'uploads');

// Files live outside any static folder and are only served through the
// authenticated GET /api/career/certificates/:id/file endpoint.
export const CERTIFICATE_DIR = path.join(uploadRoot, 'certificates');
fs.mkdirSync(CERTIFICATE_DIR, { recursive: true });

export const MAX_CERTIFICATE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

// The browser-supplied MIME type can be spoofed, so the file's first bytes
// must also match the claimed type.
const SIGNATURES = {
  'application/pdf': (bytes) => bytes.subarray(0, 5).toString('latin1') === '%PDF-',
  'image/jpeg': (bytes) => bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff,
  'image/png': (bytes) => bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  'image/webp': (bytes) => bytes.subarray(0, 4).toString('latin1') === 'RIFF' && bytes.subarray(8, 12).toString('latin1') === 'WEBP',
};

const upload = multer({
  storage: multer.diskStorage({
    destination: CERTIFICATE_DIR,
    filename: (req, file, cb) => cb(null, `${randomUUID()}${ALLOWED_TYPES[file.mimetype]}`),
  }),
  limits: { fileSize: MAX_CERTIFICATE_SIZE, files: 1, fields: 20 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES[file.mimetype]) {
      const error = new Error('Only PDF, JPG, PNG, or WEBP files are allowed.');
      error.code = 'INVALID_FILE_TYPE';
      cb(error);
      return;
    }
    cb(null, true);
  },
});

export const certificateFilePath = (storedName) => path.join(CERTIFICATE_DIR, path.basename(storedName));

export const removeCertificateFile = async (storedName) => {
  if (!storedName) return;
  await fs.promises.unlink(certificateFilePath(storedName)).catch(() => {});
};

const readHeader = async (filePath) => {
  const handle = await fs.promises.open(filePath, 'r');
  try {
    const buffer = Buffer.alloc(12);
    await handle.read(buffer, 0, 12, 0);
    return buffer;
  } finally {
    await handle.close();
  }
};

// Accepts a single optional `file` field (PDF, JPG, PNG, WEBP up to 5 MB).
export const certificateUpload = (req, res, next) => {
  upload.single('file')(req, res, async (error) => {
    if (error) {
      const message =
        error.code === 'LIMIT_FILE_SIZE'
          ? 'File is too large. The maximum size is 5 MB.'
          : error.code === 'LIMIT_UNEXPECTED_FILE'
            ? 'Upload a single file in the "file" field.'
            : error.message || 'File upload failed.';
      return res.status(400).json({ message });
    }

    try {
      if (req.file) {
        const header = await readHeader(req.file.path);
        if (!SIGNATURES[req.file.mimetype]?.(header)) {
          await removeCertificateFile(req.file.filename);
          return res.status(400).json({ message: 'The file content does not match its type. Upload a valid PDF, JPG, PNG, or WEBP.' });
        }
      }
      next();
    } catch (checkError) {
      next(checkError);
    }
  });
};
