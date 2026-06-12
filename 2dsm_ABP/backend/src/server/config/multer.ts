import crypto from 'crypto';
import fs from 'fs';
import multer from 'multer';
import path from 'path';

export const pdfUploadDir = path.resolve(process.cwd(), 'uploads', 'pdfs');
const maxPdfSizeBytes = 10 * 1024 * 1024;

if (!fs.existsSync(pdfUploadDir)) {
  fs.mkdirSync(pdfUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, pdfUploadDir);
  },
  filename: (_req, _file, cb) => {
    const safeName = `${Date.now()}-${crypto.randomBytes(12).toString('hex')}`;
    cb(null, `${safeName}.pdf`);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: maxPdfSizeBytes,
  },
  fileFilter: (_req, file, cb) => {
    const originalExt = path.extname(file.originalname).toLowerCase();
    if (file.mimetype === 'application/pdf' && originalExt === '.pdf') {
      cb(null, true);
      return;
    }

    cb(new Error('Apenas arquivos PDF sao permitidos.'));
  },
});

export function getUploadedPdfUrl(file: Express.Multer.File): string {
  return `/uploads/pdfs/${file.filename}`;
}
