import express from 'express';
import { MessageController } from '../controllers/message.controller';

const router = express.Router();

// POST /messages
router.post('/dm', (req, res) => {
    MessageController.createMessage(req, res);
});

// // GET /messages/channel/:channelId
// router.get('/channel/:channelId', MessageController.getMessagesByChannel);

// Instead of '/channel/:channelId'
router.get('/between/:userId1/:userId2', (req, res) => {
    MessageController.getMessagesBetweenUsers(req, res)
});

// GET /messages/:id
router.get('/:id', (req, res) => {
    MessageController.getMessageById(req, res)
});

// PUT /messages/:id
router.put('/:id', (req, res) => {
    MessageController.updateMessage(req, res)
});

// DELETE /messages/:id
router.delete('/:id', (req, res) => {
    MessageController.deleteMessage(req, res)
});

export default router;

