export interface Workspace {
  id: string;
  name: string;
  description: string;
  subdomain: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'member' | 'user';
  title: string;
  department: string;
  status: 'active' | 'inactive';
  workspaces?: WorkspaceMember[];
}

export interface WorkspaceMember {
  workspaceId: string;
  userId: string;
  role: 'admin' | 'member';
  title: string;
  department: string;
  createdAt: string;
}

export interface Channel {
  id: string;
  workspaceId: string;
  name: string;
  description: string;
  isPrivate: boolean;
  createdBy: string;
  createdAt: string;
  members: string[];
}

export interface Message {
  id: string;
  channelId: string;
  userId: string;
  content: string;
  isEdited?: boolean;
  parentId?: string;
  timestamp: string;
  reactions: Reaction[];
  attachments?: Attachment[];
  threads: Message[];
}

export interface Reaction {
  id: string;
  messageId: string;
  userId: string;
  emoji: string;
  timestamp: string;
}

export interface Attachment {
  id: string;
  messageId?: string;
  directMessageId?: string;
  userId: string;
  name: string;
  type: string;
  url: string;
  size: number;
  uploadedAt: string;
}

export interface DirectMessage {
  id: string;
  workspaceId: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  timestamp: string;
  attachments?: Attachment[];
}