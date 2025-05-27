import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { 
  Hash, 
  Info, 
  UserPlus, 
  Smile, 
  Paperclip, 
  Send,
  MessageSquare
} from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import MessageComponent from '../components/messaging/Message';

const Channel: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { channels, messages, users, sendMessage, addReaction, removeReaction, uploadAttachment } = useWorkspace();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const channel = channels.find(c => c.id === channelId);
  const channelMessages = channelId ? messages[channelId] || [] : [];
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [channelMessages]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && channelId) {
      sendMessage(channelId, newMessage);
      setNewMessage('');
    }
  };
  
  const handleFileUpload = (files: FileList) => {
    if (channelId) {
      uploadAttachment(channelId, files);
    }
  };
  
  if (!channel) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Channel not found</h2>
          <p className="text-gray-500">The channel you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Channel Header */}
      <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <Hash className="text-gray-600 mr-2" />
          <h2 className="font-bold text-lg">{channel.name}</h2>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="ml-2 text-gray-500 hover:text-indigo-600"
          >
            <Info size={18} />
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {channel.members.slice(0, 3).map(memberId => {
              const member = users.find(u => u.id === memberId);
              return member ? (
                <Avatar 
                  key={member.id} 
                  src={member.avatar} 
                  alt={member.name} 
                  size="small" 
                />
              ) : null;
            })}
            
            {channel.members.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                +{channel.members.length - 3}
              </div>
            )}
          </div>
          
          <button className="text-gray-500 hover:text-indigo-600">
            <UserPlus size={18} />
          </button>
        </div>
      </div>
      
      {/* Channel Info Panel */}
      {showInfo && (
        <div className="bg-white p-4 border-b border-gray-200 overflow-hidden transition-all">
          <h3 className="font-semibold mb-2">About #{channel.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{channel.description}</p>
          
          <div className="mb-4">
            <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Members ({channel.members.length})</h4>
            <div className="flex flex-wrap gap-2">
              {channel.members.map(memberId => {
                const member = users.find(u => u.id === memberId);
                return member ? (
                  <div key={member.id} className="flex items-center">
                    <Avatar src={member.avatar} alt={member.name} size="small" />
                    <span className="ml-2 text-sm">{member.name}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
          
          <div className="text-xs text-gray-500">
            Created on {new Date(channel.createdAt).toLocaleDateString()}
          </div>
        </div>
      )}
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {channelMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Hash size={48} className="text-gray-300 mb-2" />
            <h3 className="text-xl font-bold text-gray-700">Welcome to #{channel.name}</h3>
            <p className="text-gray-500 max-w-md">
              This is the start of the #{channel.name} channel. Send a message to start the conversation!
            </p>
          </div>
        ) : (
          channelMessages.map(message => {
            const messageUser = users.find(u => u.id === message.userId);
            return (
              <MessageComponent 
                key={message.id}
                message={message}
                user={messageUser}
                onReactionAdd={addReaction}
                onReactionRemove={removeReaction}
                onFileUpload={(messageId, files) => handleFileUpload(files)}
              />
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
                  placeholder={`Message #${channel.name}`}
                  className="w-full bg-transparent focus:outline-none resize-none"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-1 text-gray-500">
                <button type="button" className="p-1 rounded hover:bg-gray-200">
                  <Smile size={18} />
                </button>
                <button 
                  type="button" 
                  className="p-1 rounded hover:bg-gray-200"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip size={18} />
                </button>
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className={`p-1 rounded ${
                    newMessage.trim() ? 'text-indigo-600 hover:bg-indigo-100' : 'text-gray-400'
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </form>
        
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          multiple
        />
      </div>
    </div>
  );
};

export default Channel;