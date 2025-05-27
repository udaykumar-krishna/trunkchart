// /src/services/message.service.ts
import { v4 as uuidv4 } from 'uuid'
import { db } from '../config/db.config';

export interface MessagePayload {
    id: string;
    workspaceId: string;
    senderId: string;
    receiverId: string;
    content: string;
    isRead?: boolean;
}

export class MessageService {
    static async createMessage(payload: MessagePayload) {
        const id = uuidv4();
        await db('direct_messages').insert({
            id: id,
            workspace_id: payload.workspaceId,
            sender_id: payload.senderId,
            receiver_id: payload.receiverId,
            content: payload.content
        });
        return id;
    }

    static async getMessagesBetweenUsers(userId1: string, userId2: string) {
        // return await db('direct_messages')
        //     .select(
        //         'id',
        //         'workspace_id as workspaceId',
        //         'sender_id as senderId',
        //         'receiver_id as receiverId',
        //         'content',
        //         'timestamp'
        //     )
        //     .where(function () {
        //         this.where('sender_id', userId1).andWhere('receiver_id', userId2)
        //             .orWhere('sender_id', userId2).andWhere('receiver_id', userId1)
        //     })
        //     .orderBy('timestamp', 'asc');
        const messages = await db('direct_messages as dm')
            .leftJoin('attachments as att', 'dm.id', 'att.direct_message_id')
            .select(
                'dm.id as message_id',
                'dm.workspace_id',
                'dm.sender_id',
                'dm.receiver_id',
                'dm.content',
                'dm.is_read',
                'dm.timestamp',
                'att.id as attachment_id',
                'att.name as attachment_name',
                'att.type as attachment_type',
                'att.url as attachment_url',
                'att.size as attachment_size',
            )
            .where(function() {
                this.where('dm.sender_id', userId1).andWhere('dm.receiver_id', userId2)
                    .orWhere('dm.sender_id', userId2).andWhere('dm.receiver_id', userId1)
            })
            .orderBy('dm.timestamp', 'asc');

        const groupedMessages: any = {};

        for (const row of messages) {
            if (!groupedMessages[row.message_id]) {
                groupedMessages[row.message_id] = {
                    id: row.message_id,
                    workspaceId: row.workspace_id,
                    senderId: row.sender_id,
                    receiverId: row.receiver_id,
                    content: row.content,
                    isRead: row.is_read,
                    timestamp: row.timestamp,
                    attachments: []
                };
            }
            if (row.attachment_id) {
                groupedMessages[row.message_id].attachments.push({
                    id: row.attachment_id,
                    name: row.attachment_name,
                    type: row.attachment_type,
                    url: row.attachment_url,
                    size: row.attachment_size
                });
            }
        }
        return Object.values(groupedMessages);
    }


    static async getMessageById(id: string) {
        return await db('direct_messages')
            .where({ id })
            .first();
    }

    static async updateMessage(id: string, content: string) {
        await db('direct_messages')
            .where({ id })
            .update({ content, is_edited: true });
    }

    static async deleteMessage(id: string) {
        await db('direct_messages')
            .where({ id })
            .del();
    }
}
