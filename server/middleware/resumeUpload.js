import path from 'node:path';
import multer from 'multer';

// Resumes are only read for analysis, never stored, so they stay in memory.
export const MAX_RESUME_SIZE = 5 * 1024 * 1024;

// Browsers report types inconsistently (DOCX is sometimes application/octet-stream),
// so the extension decides the kind of file and the first bytes confirm it.
const KINDS = {
  '.pdf': { kind: 'pdf', matches: (bytes) => bytes.subarray(0, 5).toString('latin1') === '%PDF-' },
  '.docx': { kind: 'docx', matches: (bytes) => bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04 },
  '.txt': { kind: 'txt', matches: (bytes) => !bytes.subarray(0, 1024).includes(0) },
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_RESUME_SIZE, files: 1, fields: 5 },
  fileFilter: (req, file, cb) => {
    if (!KINDS[path.extname(file.originalname).toLowerCase()]) {
      const error = new Error('Upload your resume as a PDF, DOCX, or TXT file.');
      error.code = 'INVALID_FILE_TYPE';
      cb(error);
      return;
    }
    cb(null, true);
  },
});

// Accepts one `resume` file and sets req.resumeKind to 'pdf', 'docx', or 'txt'.
export const resumeUpload = (req, res, next) => {
  upload.single('resume')(req, res, (error) => {
    if (error) {
      const message =
        error.code === 'LIMIT_FILE_SIZE'
          ? 'The resume is too large. The maximum size is 5 MB.'
          : error.code === 'LIMIT_UNEXPECTED_FILE'
            ? 'Upload a single file in the "resume" field.'
            : error.message || 'Resume upload failed.';
      return res.status(400).json({ message });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'Choose a resume file to upload.' });
    }

    const type = KINDS[path.extname(req.file.originalname).toLowerCase()];
    if (!type.matches(req.file.buffer)) {
      return res.status(400).json({ message: 'The file content does not match its type. Upload a valid PDF, DOCX, or TXT resume.' });
    }
    req.resumeKind = type.kind;
    next();
  });
};
