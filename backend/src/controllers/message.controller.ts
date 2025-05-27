// /src/controllers/message.controller.ts

import { Request, Response } from 'express';
import { MessageService } from '../services/message.service';
import path from 'path';

export class MessageController {
    static async createMessage(req: Request, res: Response) {
        try {
            const id = await MessageService.createMessage(req.body);
            return res.status(201).json({ message: 'Message created', data: id });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to create message' });
        }
    }

    static async getMessagesBetweenUsers(req: Request, res: Response) {
        try {
            const { userId1, userId2 } = req.params;
            const messages = await MessageService.getMessagesBetweenUsers(userId1, userId2);
            return res.json(messages);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to fetch messages between users' });
        }
    }

    static async getMessageById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const message = await MessageService.getMessageById(id);
            if (!message) {
                return res.status(404).json({ error: 'Message not found' });
            }
            return res.json(message);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to fetch message' });
        }
    }

    static async updateMessage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { content } = req.body;
            await MessageService.updateMessage(id, content);
            return res.json({ message: 'Message updated' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to update message' });
        }
    }

    static async deleteMessage(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await MessageService.deleteMessage(id);
            return res.json({ message: 'Message deleted' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to delete message' });
        }
    }
}
