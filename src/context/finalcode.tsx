import React, { createContext, useContext, useState, useEffect } from 'react';
import { Workspace, Channel, Message, DirectMessage, User, Reaction, Attachment } from '../types';

interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  users: User[];
  messages: Record<string, Message[]>;
  directMessages: Record<string, DirectMessage[]>;
  sendMessage: (channelId: string, content: string) => void;
  sendDirectMessage: (userId: string, content: string) => void;
  addReaction: (messageId: string, emoji: string) => void;
  removeReaction: (messageId: string, reactionId: string) => void;
  uploadAttachment: (messageId: string, files: FileList) => void;
  editMessage: (channelId: string, messageId: string, content: string) => void;
  deleteMessage: (channelId: string, messageId: string) => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Mock data
const mockWorkspace: Workspace = {
  id: '1',
  name: 'TrunkChart Team',
  description: 'Main workspace for TrunkChart',
  subdomain: 'trunkchart',
  ownerId: '1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@trunkchart.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    role: 'admin',
    title: 'CEO',
    department: 'Executive',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@trunkchart.com',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    role: 'user',
    title: 'Marketing Director',
    department: 'Marketing',
    status: 'active',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@trunkchart.com',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    role: 'user',
    title: 'Software Engineer',
    department: 'Engineering',
    status: 'active',
  },
];

const mockDirectMessages: Record<string, DirectMessage[]> = {
  '2': [
    {
      id: 'dm1',
      workspaceId: '1',
      senderId: '1',
      receiverId: '2',
      content: 'Hi Jane, how\'s the marketing campaign going?',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      isRead: true
    },
    {
      id: 'dm2',
      workspaceId: '2',
      senderId: '2',
      receiverId: '1',
      content: 'Going well! We\'re on track to launch next week.',
      timestamp: new Date(Date.now() - 3500000).toISOString(),
      isRead: true
    }
  ],
  '3': [
    {
      id: 'dm3',
      workspaceId: '1',
      senderId: '1',
      receiverId: '3',
      content: 'Bob, can you help with the backend issue?',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      isRead: true
    },
    {
      id: 'dm4',
      workspaceId: '3',
      senderId: '3',
      receiverId: '1',
      content: 'Sure thing, I\'ll take a look right away.',
      timestamp: new Date(Date.now() - 7100000).toISOString(),
      isRead: true
    }
  ]
};


export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(mockWorkspace);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  const [directMessages, setDirectMessages] = useState<Record<string, DirectMessage[]>>(mockDirectMessages);

  const sendMessage = (channelId: string, content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      channelId,
      userId: '1', // Assuming current user is the admin
      content,
      isEdited: false,
      timestamp: new Date().toISOString(),
      reactions: [],
      attachments: [],
      threads: []
    };
    
    setMessages(prev => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMessage]
    }));
  };

  const sendDirectMessage = (userId: string, content: string) => {
    const newDM: DirectMessage = {
      id: `dm-${Date.now()}`,
      workspaceId: userId,
      senderId: '1', // Assuming current user is the admin
      receiverId: userId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    setDirectMessages(prev => ({
      ...prev,
      [userId]: [...(prev[userId] || []), newDM]
    }));
  };

  const addReaction = (messageId: string, emoji: string) => {
    const newReaction: Reaction = {
      id: `reaction-${Date.now()}`,
      messageId: '1',
      userId: '1', // Assuming current user is the admin
      emoji,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => {
      const newMessages = { ...prev };
      Object.keys(newMessages).forEach(channelId => {
        newMessages[channelId] = newMessages[channelId].map(message => {
          if (message.id === messageId) {
            return {
              ...message,
              reactions: [...message.reactions, newReaction]
            };
          }
          return message;
        });
      });
      return newMessages;
    });
  };

  const removeReaction = (messageId: string, reactionId: string) => {
    setMessages(prev => {
      const newMessages = { ...prev };
      Object.keys(newMessages).forEach(channelId => {
        newMessages[channelId] = newMessages[channelId].map(message => {
          if (message.id === messageId) {
            return {
              ...message,
              reactions: message.reactions.filter(r => r.id !== reactionId)
            };
          }
          return message;
        });
      });
      return newMessages;
    });
  };

  const uploadAttachment = (messageId: string, files: FileList) => {
    const newAttachments: Attachment[] = Array.from(files).map(file => ({
      id: `attachment-${Date.now()}-${file.name}`,
      messageId: messageId,
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file),
      size: file.size,
      uploadedAt: new Date().toISOString(),
      userId: '1' // Assuming current user is the admin
    }));

    setMessages(prev => {
      const newMessages = { ...prev };
      Object.keys(newMessages).forEach(channelId => {
        newMessages[channelId] = newMessages[channelId].map(message => {
          if (message.id === messageId) {
            return {
              ...message,
              attachments: [...message.attachments, ...newAttachments]
            };
          }
          return message;
        });
      });
      return newMessages;
    });
  };

  const editMessage = (channelId: string, messageId: string, content: string) => {
    setMessages(prev => ({
      ...prev,
      [channelId]: prev[channelId].map(message =>
        message.id === messageId
          ? { ...message, content, edited: true }
          : message
      )
    }));
  };

  const deleteMessage = (channelId: string, messageId: string) => {
    setMessages(prev => ({
      ...prev,
      [channelId]: prev[channelId].filter(message => message.id !== messageId)
    }));
  };

  return (
    <WorkspaceContext.Provider value={{ 
      currentWorkspace,
      users: mockUsers,
      messages,
      directMessages,
      sendMessage,
      sendDirectMessage,
      addReaction,
      removeReaction,
      uploadAttachment,
      editMessage,
      deleteMessage
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};