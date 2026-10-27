import mammoth from 'mammoth';
import { extractText, getDocumentProxy } from 'unpdf';

export const MAX_RESUME_CHARS = 20000;

export class ResumeParseError extends Error {}

// Collapses the stray spacing PDF and Word extraction produce, keeping line breaks.
const tidy = (text) =>
  text
    .replace(/\r/g, '')
    .replace(/[ \t ]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

// Returns the plain text of a resume buffer. `kind` is 'pdf', 'docx', or 'txt'.
export const extractResumeText = async (buffer, kind) => {
  let text;
  try {
    if (kind === 'pdf') {
      const pdf = await getDocumentProxy(new Uint8Array(buffer));
      ({ text } = await extractText(pdf, { mergePages: true }));
    } else if (kind === 'docx') {
      ({ value: text } = await mammoth.extractRawText({ buffer }));
    } else {
      text = buffer.toString('utf8');
    }
  } catch {
    throw new ResumeParseError('This file could not be read. Make sure it is not password-protected or damaged.');
  }

  text = tidy(text || '');
  if (text.length < 50) {
    throw new ResumeParseError('No readable text was found. If your resume is a scanned image, export it as a text-based PDF or DOCX.');
  }
  return text.slice(0, MAX_RESUME_CHARS);
};
