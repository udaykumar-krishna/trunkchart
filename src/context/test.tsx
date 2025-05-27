import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Workspace, DirectMessage, User } from '../types';

interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  users: User[];
  directMessages: Record<string, DirectMessage[]>;
  sendDirectMessage: (userId: string, content: string) => void;
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
  const [directMessages, setDirectMessages] = useState<Record<string, DirectMessage[]>>(mockDirectMessages);

  const sendDirectMessage = (userId: string, content: string) => {
    const newDM: DirectMessage = {
      id: `dm-${Date.now()}`,
      workspaceId: userId,
      senderId: '1', // add logic to dynamically pass senderId
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


  return (
    <WorkspaceContext.Provider value={{ 
      currentWorkspace,
      users: mockUsers,
      directMessages,
      sendDirectMessage,
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