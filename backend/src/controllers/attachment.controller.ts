import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/db.config';
import path from 'path';
import fs from 'fs';
import { error } from 'console';
import mime from 'mime-types';

export const AttachmentController = {
  uploadAttachment: async (req: Request, res: Response) => {
    try {
      const { type, id } = req.params;
      const { userId } = req.body;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      if (!['direct', 'group'].includes(type)) {
        return res.status(400).json({ error: 'Invalid attachment type' });
      }

      const uploadedAttachments = files.map(file => {
        const base = {
          id: uuidv4(),
          user_id: userId,
          name: file.originalname,
          type: file.mimetype,
          url: `/uploads/attachments/${file.filename}`,
          size: file.size,
          uploaded_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        };

        return type === 'direct'
          ? { ...base, direct_message_id: id }
          : { ...base, message_id: id };
      });
      await db('attachments').insert(uploadedAttachments);

      res.status(201).json({
        message: 'Attachments uploaded successfully',
        attachments: uploadedAttachments,
      });
    } catch (error) {
      console.error('Error uploading attachment:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  downloadAttachment: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const attachment = await db('attachments').where({ id }).first();
      console.log('attachment found: ',attachment)
      
      if (!attachment) return res.status(404).json({ error: 'File not found' });

      const filePath = path.join(__dirname, '../../', attachment.url);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File does not exist' });
      }
      const fileName = path.basename(filePath);
      const fileMimeType = mime.lookup(filePath) || 'application/octet-stream';
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', fileMimeType);
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error('Error downloading attachment: ', error);
      res.status(500).json({ error: 'Something went wrong when downloading attachment' })
    }
  }
};
