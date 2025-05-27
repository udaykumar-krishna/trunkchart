import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { Smile, Paperclip, Send, Phone, Video } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import MessageComponent from '../components/messaging/Message';
import axios from 'axios'

const DirectMessage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  console.log("user id from param: ", typeof (userId))
  const { users, directMessages, sendDirectMessage, setDirectMessages } = useWorkspace();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const otherUser = users.find(u => String(u.id) === userId);
  // console.log('otherUser in directmessage: ', typeof (users[0].id))
  const conversationMessages = userId ? directMessages[userId] || [] : [];
  // console.log("conversation messages: ", conversationMessages)
  console.log("users: ", users)

  useEffect(() => {
    console.log("Updated conversationMessages:", conversationMessages);
  }, [conversationMessages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.id || !userId) return;
      try {
        const response = await axios.get(`http://localhost:5000/api/messages/between/${user.id}/${userId}`);
        console.log("fetched users and messages: ", response)
        setDirectMessages(prev => ({
          ...prev,
          [userId]: response.data
        }));

      } catch (err) {
        console.error('Error fetching messages: ', err);
      }
    };
    fetchMessages();
  }, [user?.id, userId, setDirectMessages]); //directMessages

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const senderId = user?.id;
    if (newMessage.trim() && userId && senderId) {
      sendDirectMessage(userId, senderId, newMessage);
      setNewMessage('');
    }
  };

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && userId) {
      const lastMessage = conversationMessages[conversationMessages.length - 1];
      const directMessageId = lastMessage?.id;

      if (!directMessageId) {
        console.log('No message to attach file to')
        return;
      }

      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append('attachments', files[i]);
      }
      formData.append('userId', userId)

      try {
        const res = await fetch(
          `http://localhost:5000/api/attachments/direct/${directMessageId}/attachments`, {
          method: 'POST',
          credentials: 'include',
          body: formData
        }
        );
        const result = await res.json()

        const uploadedAttachments = result.data.attachments || [];

        setDirectMessages(prev => {
          const newMessages = { ...prev };
          newMessages[userId] = newMessages[userId].map(msg =>
            msg.id === directMessageId
              ? {
                ...msg,
                attachments: [...(msg.attachments || []), ...uploadedAttachments]
              }
              : msg
          );
          return newMessages;
        });
      } catch (error) {
        console.error('Attachment upload failed:', error);
      }
    }
  }

  const renderAttachment = (attachment: any) => {
    const fileType = attachment.type;
    const fileUrl = attachment.url;
    <div className="border p-2 rounded bg-white shadow mb-2">
      <div className="text-sm text-gray-700 font-medium mb-1">{attachment.name} ({(attachment.size / 1024).toFixed(1)} KB)</div>
      {fileType.startsWith('image/') && (
        <img src={fileUrl} alt={attachment.name} className="max-w-xs max-h-48 rounded" />
      )}
      {fileType === 'application/pdf' && (
        <>
        <embed src={`/attachment/${attachment.id}/#toolbar=0`} type="application/pdf" width="100%" height="200px" className="rounded" />
        <a href={fileUrl} download className="text-sm text-blue-600 hover:underline mt-2 inline-block">
          Download
        </a></>
      )}
      {!fileType.startsWith('image/') && fileType !== 'application/pdf' && (
        <div className="text-sm text-gray-600">Unsupported preview. Click below to download.</div>
      )}
      
    </div>


    // if (fileType.startsWith('image/')) {
    //   return <img src={fileUrl} alt={attachment.name} className='max-w-xs max-h-48 rounded shadow' />;
    // } else if (fileType === 'application/pdf') {
    //   return (
    //     <div className='border rounded p-2 bg-gray-50'>
    //       <embed src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} type="application/pdf" width="100%" height="200px" className='rounded' />
    //       {/* <a href={fileUrl} download className='text-sm text-blue-600 hover:underline mt-1 block'>Download PDF</a> */}
    //     </div>
    //   );
    // } else {
    //   return (
    //     <a 
    //       href={fileUrl}
    //       download
    //       className='text-sm text-blue-600 hover:underline border rounded px-2 py-1 inline-block bg-gray-50'
    //     >
    //       Download {attachment.name}
    //     </a>
    //   )
    // }
  }

  if (!otherUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">User not found</h2>
          <p className="text-gray-500">The user you're trying to message doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Convert DMs to a format compatible with MessageComponent
  const formattedMessages = conversationMessages.map(dm => ({
    id: dm.id,
    channelId: 'dm',
    userId: dm.senderId,
    content: dm.content,
    timestamp: dm.timestamp,
    reactions: [],
    attachments: dm.attachments,
    threads: []
  }));

  // console.log("formatted messages: ", formattedMessages)

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* DM Header */}
      <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <Avatar
            src={otherUser.avatar}
            alt={otherUser.name}
            status="online"
          />
          <div className="ml-3">
            <h2 className="font-bold">{otherUser.name}</h2>
            <p className="text-xs text-gray-500">{otherUser.title} • {otherUser.department}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="text-gray-500 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100">
            <Phone size={18} />
          </button>
          <button className="text-gray-500 hover:text-indigo-600 p-2 rounded-full hover:bg-gray-100">
            <Video size={18} />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {formattedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Avatar
              src={otherUser.avatar}
              alt={otherUser.name}
              size="large"
            />
            <h3 className="text-xl font-bold text-gray-700 mt-4">{otherUser.name}</h3>
            <p className="text-gray-500 max-w-md mt-2">
              This is the beginning of your direct message history with {otherUser.name}.
            </p>
          </div>
        ) : (
          formattedMessages.map(message => {
            const messageUser = users.find(u => String(u.id) === message.userId);
            // console.log('messageUser: ', messageUser, typeof (message.userId))
            return (
              <div key={message.id} className='space-y-2'>
                <MessageComponent
                  key={message.id}
                  message={message}
                  user={messageUser}
                  isDirect
                />
                
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-end">
          <div className="flex-1 bg-gray-100 rounded-lg p-3 min-h-12">
            <div className="flex items-end">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={`Message ${otherUser.name}`}
                  className="w-full bg-transparent focus:outline-none resize-none"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </div>

              <div className="flex items-center space-x-1 text-gray-500">
                <button type="button" className="p-1 rounded hover:bg-gray-200">
                  <Smile size={18} />
                </button>
                <button type="button" className="p-1 rounded hover:bg-gray-200" onClick={handlePaperclipClick}>
                  <Paperclip size={18} />
                </button>
                <input
                  type='file'
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  multiple
                  onChange={handleFileChange}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`p-1 rounded ${newMessage.trim() ? 'text-indigo-600 hover:bg-indigo-100' : 'text-gray-400'
                    }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DirectMessage;