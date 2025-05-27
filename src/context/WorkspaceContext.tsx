import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Workspace, Channel, Message, DirectMessage, User, Reaction, Attachment } from '../types';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface WorkspaceContextType {
  workspaces: Workspace[] | null;
  currentWorkspace: Workspace | null;
  channels: Channel[];
  users: User[];
  messages: Record<string, Message[]>;
  directMessages: Record<string, DirectMessage[]>;
  createChannel: (name: string, description: string, isPrivate: boolean) => void;
  sendMessage: (channelId: string, content: string) => void;
  sendDirectMessage: (userId: string, senderId: string, content: string) => void;
  addReaction: (messageId: string, emoji: string) => void;
  removeReaction: (messageId: string, reactionId: string) => void;
  uploadAttachment: (messageId: string, files: FileList) => void;
  editMessage: (channelId: string, messageId: string, content: string) => void;
  deleteMessage: (channelId: string, messageId: string) => void;
  loadDirectMessages: (userId: string, messages: DirectMessage[]) => void;
  setDirectMessages: React.Dispatch<React.SetStateAction<{ [userId: string]: DirectMessage[] }>>;
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

const mockChannels: Channel[] = [
  { 
    id: '1', 
    workspaceId: '1',
    name: 'general', 
    description: 'General discussions', 
    isPrivate: false,
    createdBy: '1',
    createdAt: new Date().toISOString(),
    members: ['1', '2', '3']
  },
  { 
    id: '2', 
    workspaceId: '2',
    name: 'random', 
    description: 'Random conversations', 
    isPrivate: false,
    createdBy: '1',
    createdAt: new Date().toISOString(),
    members: ['1', '2', '3']
  },
  { 
    id: '3', 
    workspaceId: '3',
    name: 'engineering', 
    description: 'Engineering team discussions', 
    isPrivate: false,
    createdBy: '3',
    createdAt: new Date().toISOString(),
    members: ['1', '3']
  },
  { 
    id: '4', 
    workspaceId: '4',
    name: 'marketing', 
    description: 'Marketing team discussions', 
    isPrivate: false,
    createdBy: '2',
    createdAt: new Date().toISOString(),
    members: ['1', '2']
  },
];

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

// Mock messages
const generateMockMessages = (channelId: string): Message[] => {
  const messages: Message[] = [];
  const users = ['1', '2', '3'];
  const contents = [
    'Hello team!',
    'How is everyone doing today?',
    'I just pushed a new update to the repo',
    'Great work everyone!',
    'Let\'s discuss this in our meeting tomorrow',
    'Has anyone seen the latest analytics report?',
    'I need help with this bug',
    'Looking forward to our team lunch next week!'
  ];
  
  for (let i = 0; i < 10; i++) {
    const timestamp = new Date();
    timestamp.setHours(timestamp.getHours() - i);
    
    messages.push({
      id: `${channelId}-${i}`,
      channelId,
      userId: users[i % users.length],
      content: contents[i % contents.length],
      isEdited: false,
      timestamp: timestamp.toISOString(),
      reactions: [],
      attachments: [],
      threads: []
    });
  }
  
  return messages;
};

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

// Generate mock messages for each channel
const mockMessages: Record<string, Message[]> = {};
mockChannels.forEach(channel => {
  mockMessages[channel.id] = generateMockMessages(channel.id);
});

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[] | null>(null);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [channels, setChannels] = useState<Channel[]>(mockChannels);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);
  // const [directMessages, setDirectMessages] = useState<Record<string, DirectMessage[]>>(mockDirectMessages);
  const [directMessages, setDirectMessages] = useState<{ [userId: string]: DirectMessage[] }>({});
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try{
        const res = await axios.get('http://localhost:5000/api/auth/users');
        console.log("all users: ",res)
        setUsers(res.data);
      } catch(err) {
        console.error('Failed to fetch all users: ',err);
      }
    };
    fetchUsers();
  }, [])

  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/workspaces/allworkspaces');
        console.log("all workspaces: ",res)
        setWorkspaces(res.data)
      } catch (error) {
        console.log('Error fetching workspaces in frontend: ', error)
      }
    };
    fetchWorkspaces();
  }, [])

  useEffect(() => {
    const fetchCurrentWorkspace = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/workspaces/current/${user?.id}`);
        const data = await res.json();
        setCurrentWorkspace(data.workspace);
      } catch (err) {
        console.log('Failed to load current workspace: ',err)
      }
    };

    if (user?.id) {
      fetchCurrentWorkspace();
    }
  }, [user?.id])

  useEffect(() => {
    if (!user?.id) return;
 
    const ws = new WebSocket('ws://localhost:5000');
    ws.onopen = () => console.log('WebSocket connected');

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'dm' && data.message) {
        const msg: DirectMessage = data.message;
        const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId;
        setDirectMessages(prev => ({
          ...prev,
          [otherUserId]: [...(prev[otherUserId] || []), msg]
        }));
      }
    };
    ws.onclose = () => console.log('WebSocket disconnected');
    ws.onerror = (err) => console.log('WebSocket error: ',err);

    setSocket(ws);
    return () => ws.close();
  }, [user?.id]);

  const createChannel = (name: string, description: string, isPrivate: boolean) => {
    const newChannel: Channel = {
      id: `channel-${Date.now()}`,
      workspaceId: '1',
      name,
      description,
      isPrivate,
      createdBy: '1', // Assuming current user is the admin
      createdAt: new Date().toISOString(),
      members: ['1'] // Start with just the creator
    };
    
    setChannels(prev => [...prev, newChannel]);
    setMessages(prev => ({
      ...prev,
      [newChannel.id]: []
    }));
  };

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

  const sendDirectMessage = async (userId: string, senderId: string, content: string) => {
    if (!currentWorkspace || !senderId) return;
    try {
      const response = await fetch('http://localhost:5000/api/messages/dm', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          workspaceId: currentWorkspace.id,
          senderId: senderId,
          receiverId: userId,
          content
        })
      });
      const result = await response.json();
      if (response.ok) {
        const newDM: DirectMessage = {
          id: result.data,
          workspaceId: currentWorkspace.id,
          senderId: senderId,
          receiverId: userId,
          content,
          timestamp: new Date().toISOString(),
          isRead: false
        }

        setDirectMessages(prev => ({
          ...prev,
          [userId]: [...(prev[userId] || []), newDM]
        }));

        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: 'dm', message: newDM }));
        }
      }
    }catch (error) {
      console.error('Failed to send message', error);
    }
    // const newDM: DirectMessage = {
    //   id: `dm-${Date.now()}`,
    //   workspaceId: userId,
    //   senderId: '1', // Assuming current user is the admin
    //   receiverId: userId,
    //   content,
    //   timestamp: new Date().toISOString(),
    //   isRead: false
    // };
    
    // setDirectMessages(prev => ({
    //   ...prev,
    //   [userId]: [...(prev[userId] || []), newDM]
    // }));
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

  const loadDirectMessages = useCallback((userId: string, messages: DirectMessage[]) => {
    setDirectMessages(prev => ({
      ...prev,
      [userId]: messages
    }));
  }, []);

  return (
    <WorkspaceContext.Provider value={{ 
      workspaces,
      currentWorkspace,
      channels,
      users,
      messages,
      directMessages,
      createChannel,
      sendMessage,
      sendDirectMessage,
      addReaction,
      removeReaction,
      uploadAttachment,
      editMessage,
      deleteMessage,
      loadDirectMessages,
      setDirectMessages
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