import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import messageRoutes from './routes/message.routes'
import attachmentRoutes from './routes/attachment.routes'
import workspaceRoutes from './routes/workspaces.routes'
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser'

dotenv.config();

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes)
app.use('/api/attachments', attachmentRoutes)
app.use('/api/workspaces', workspaceRoutes)

export default app;
