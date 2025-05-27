import React, { useState, useRef } from 'react';
import { Message, User, Reaction, Attachment } from '../../types';
import Avatar from '../ui/Avatar';
import ChatAttachmentPreview from './ChatAttachmentPreview'

import { 
  ThumbsUp, 
  MessageSquare, 
  Smile, 
  Reply, 
  X, 
  Paperclip, 
  Download,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { formatDistanceToNow } from '../../utils/dateUtils';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';

interface MessageComponentProps {
  message: Message;
  user: User | undefined;
  isDirect?: boolean;
  onReactionAdd?: (messageId: string, emoji: string) => void;
  onReactionRemove?: (messageId: string, reactionId: string) => void;
  onFileUpload?: (messageId: string, files: FileList) => void;
}

const EMOJI_LIST = ['👍', '❤️', '😂', '🎉', '🙌', '👀', '💯', '🔥'];

const MessageComponent: React.FC<MessageComponentProps> = ({ 
  message, 
  user,
  isDirect = false,
  onReactionAdd,
  onReactionRemove,
  onFileUpload
}) => {
  const { user: currentUser } = useAuth();
  const { editMessage, deleteMessage } = useWorkspace();
  const [showReactions, setShowReactions] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  
  if (!user) return null;
  
  const timeAgo = formatDistanceToNow(new Date(message.timestamp));

  const handleEmojiClick = (emoji: string) => {
    if (onReactionAdd) {
      onReactionAdd(message.id, emoji);
    }
    setShowReactions(false);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0 && onFileUpload) {
      onFileUpload(message.id, files);
    }
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedContent.trim() !== message.content) {
      editMessage(message.channelId, message.id, editedContent);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      deleteMessage(message.channelId, message.id);
    }
    setShowActions(false);
  };

  // Group reactions by emoji
  const groupedReactions = message.reactions.reduce((acc, reaction) => {
    if (!acc[reaction.emoji]) {
      acc[reaction.emoji] = [];
    }
    acc[reaction.emoji].push(reaction);
    return acc;
  }, {} as Record<string, Reaction[]>);
  const isOwnMessage = message.userId === String(currentUser?.id);
  console.log('message id: ',message.userId, typeof(message.userId))
  console.log('current user id: ', currentUser?.id, typeof(currentUser?.id))
  console.log("isOwnMessage: ",isOwnMessage)

  return (
    <div className={`flex group ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div className="mr-4">
        <Avatar src={user.avatar} alt={user.name} />
      </div>
      
      <div className="min-w-0">
        <div className="flex items-center">
          <h4 className="font-bold">{user.name}</h4>
          <span className="ml-2 text-xs text-gray-500">{timeAgo}</span>
          {message.isEdited && (
            <span className="ml-2 text-xs text-gray-500">(edited)</span>
          )}
          
          {isOwnMessage && (
            <div className="relative ml-auto">
              <button
                onClick={() => setShowActions(!showActions)}
                className="invisible group-hover:visible p-1 rounded hover:bg-gray-100"
              >
                <MoreVertical size={16} className="text-gray-500" />
              </button>
              
              {showActions && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-20 py-1">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowActions(false);
                      setTimeout(() => editInputRef.current?.focus(), 0);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Edit size={16} className="mr-2" />
                    Edit Message
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete Message
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {isEditing ? (
          <form onSubmit={handleEditSubmit} className="mt-1">
            <input
              ref={editInputRef}
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditedContent(message.content);
                }
              }}
            />
            <div className="mt-2 flex items-center space-x-2 text-sm">
              <button
                type="submit"
                className="text-indigo-600 hover:text-indigo-800"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditedContent(message.content);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <span className="text-gray-400">
                Press Esc to cancel, Enter to save
              </span>
            </div>
          </form>
        ) : (
          <div className="mt-1 text-gray-800">{message.content}</div>
        )}
        
        {/* Attachments */}
        {message.attachments && message.attachments.map((att, idx) => (
          // <div key={idx} className='ml-12'>{renderAttachment(att)}</div>
          <div key={idx}>
            <ChatAttachmentPreview attachment={att} />
          </div>
        ))}
        {/* {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map((attachment) => (
              <div 
                key={attachment.id} 
                className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md"
              >
                <Paperclip size={16} className="text-gray-400" />
                <span className="flex-1 text-sm text-gray-700">{attachment.name}</span>
                <span className="text-xs text-gray-500">
                  {(attachment.size / 1024).toFixed(1)} KB
                </span>
                <a 
                  href={attachment.url}
                  download={attachment.name}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Download size={16} className="text-gray-600" />
                </a>
              </div>
            ))}
          </div>
        )} */}
        
        {/* Reactions */}
        {Object.entries(groupedReactions).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(groupedReactions).map(([emoji, reactions]) => (
              <button
                key={emoji}
                onClick={() => {
                  const userReaction = reactions.find(r => r.userId === currentUser?.id);
                  if (userReaction && onReactionRemove) {
                    onReactionRemove(message.id, userReaction.id);
                  } else if (onReactionAdd) {
                    onReactionAdd(message.id, emoji);
                  }
                }}
                className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${
                  reactions.some(r => r.userId === currentUser?.id)
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'bg-gray-100 text-gray-800'
                } hover:bg-indigo-200`}
              >
                <span className="mr-1">{emoji}</span>
                <span>{reactions.length}</span>
              </button>
            ))}
          </div>
        )}
        
        {/* Message Actions */}
        <div className="mt-1 invisible group-hover:visible flex items-center text-gray-500 gap-2">
          <button 
            className="p-1 hover:bg-gray-100 rounded" 
            onClick={() => setShowReactions(!showReactions)}
          >
            <Smile size={16} />
          </button>
          
          <button className="p-1 hover:bg-gray-100 rounded" onClick={handleFileClick}>
            <Paperclip size={16} />
          </button>
          
          <button className="p-1 hover:bg-gray-100 rounded">
            <Reply size={16} />
          </button>
          
          <button className="p-1 hover:bg-gray-100 rounded">
            <ThumbsUp size={16} />
          </button>
        </div>
        
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          multiple
        />
        
        {/* Emoji Picker */}
        {showReactions && (
          <div className="absolute bg-white border border-gray-200 rounded-lg shadow-lg p-2 mt-1 z-10">
            <div className="flex gap-2">
              {EMOJI_LIST.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleEmojiClick(emoji)}
                  className="text-xl hover:bg-gray-100 p-1 rounded"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageComponent;