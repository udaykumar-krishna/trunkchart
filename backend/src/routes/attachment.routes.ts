import { Router } from 'express';
import { AttachmentController } from '../controllers/attachment.controller';
import multer from 'multer';
import path from 'path';

// Setup multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/attachments'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});

const upload = multer({ storage });

const router = Router();

// POST /attachments
router.post('/:type/:id/attachments', upload.array('attachments'), (req, res) => {
    AttachmentController.uploadAttachment(req, res)
});

router.get('/attachment/:id/download', (req, res) => {
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self' http://localhost:5173");
  res.removeHeader('X-Frame-Options');
  AttachmentController.downloadAttachment(req, res)
})

export default router;
