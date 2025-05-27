import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../context/WorkspaceContext';
import { useAuth } from '../context/AuthContext';
import { 
  Hash, 
  MessageSquare, 
  Clock, 
  FileText, 
  Users, 
  BarChart2,
  Bell
} from 'lucide-react';
import Avatar from '../components/ui/Avatar';

const Dashboard: React.FC = () => {
  const { channels, messages, directMessages, users } = useWorkspace();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Get recent activity
  const getRecentChannelMessages = () => {
    const allMessages = Object.entries(messages).flatMap(([channelId, msgs]) => 
      msgs.map(msg => ({ ...msg, channelId }))
    );
    
    return allMessages
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5);
  };
  
  // Get unread messages - in a real app this would be from an API
  const getUnreadMessages = () => {
    let count = 0;
    let directCount = 0;
    
    // In a real app, this would check message read status properly
    directCount = 2; // Mock 2 unread direct messages
    
    return { channels: count, direct: directCount };
  };
  
  const unreadCounts = getUnreadMessages();
  const recentMessages = getRecentChannelMessages();

  // Format timestamp to relative time
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const messageDate = new Date(timestamp);
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffMins < 1440) {
      return `${Math.floor(diffMins / 60)}h ago`;
    } else {
      return `${Math.floor(diffMins / 1440)}d ago`;
    }
  };

  return (
    <div className="pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's what's happening in your workspace today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Bell className="text-indigo-600 mr-2" size={20} />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          
          {unreadCounts.direct > 0 || unreadCounts.channels > 0 ? (
            <div className="space-y-3">
              {unreadCounts.direct > 0 && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-600">
                    <MessageSquare size={16} className="mr-2" />
                    Unread direct messages
                  </span>
                  <span className="bg-red-100 text-red-600 font-medium px-2 py-1 rounded-full text-xs">
                    {unreadCounts.direct}
                  </span>
                </div>
              )}
              
              {unreadCounts.channels > 0 && (
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-gray-600">
                    <Hash size={16} className="mr-2" />
                    Unread channel messages
                  </span>
                  <span className="bg-red-100 text-red-600 font-medium px-2 py-1 rounded-full text-xs">
                    {unreadCounts.channels}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">You're all caught up! No new notifications.</p>
          )}
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Users className="text-indigo-600 mr-2" size={20} />
            <h2 className="text-lg font-semibold">Team Members</h2>
          </div>
          
          <div className="space-y-4">
            {users.slice(0, 3).map(teamMember => (
              <div key={teamMember.id} className="flex items-center">
                <Avatar 
                  src={teamMember.avatar} 
                  alt={teamMember.name}
                  status={teamMember.id === '1' ? 'online' : teamMember.id === '2' ? 'away' : 'offline'}
                  size="small"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium">{teamMember.name}</p>
                  <p className="text-xs text-gray-500">{teamMember.title}</p>
                </div>
                
                <button 
                  onClick={() => navigate(`/dm/${teamMember.id}`)}
                  className="ml-auto text-xs bg-gray-100 hover:bg-gray-200 rounded px-2 py-1"
                >
                  Message
                </button>
              </div>
            ))}
            
            <button 
              onClick={() => navigate('/organization-chart')}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              View All Team Members →
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Hash className="text-indigo-600 mr-2" size={20} />
            <h2 className="text-lg font-semibold">Channels</h2>
          </div>
          
          <div className="space-y-3">
            {channels.slice(0, 4).map(channel => (
              <div 
                key={channel.id} 
                className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                onClick={() => navigate(`/channel/${channel.id}`)}
              >
                <Hash size={16} className="text-gray-400 mr-2" />
                <span>{channel.name}</span>
                <span className="ml-auto text-xs text-gray-500">
                  {channel.members.length} members
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        
        {recentMessages.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {recentMessages.map(message => {
              const channel = channels.find(c => c.id === message.channelId);
              const messageUser = users.find(u => u.id === message.userId);
              
              return (
                <div 
                  key={message.id} 
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => navigate(`/channel/${message.channelId}`)}
                >
                  <div className="flex items-start">
                    <Avatar 
                      src={messageUser?.avatar} 
                      alt={messageUser?.name || 'User'} 
                      size="small"
                    />
                    
                    <div className="ml-3 flex-1 min-w-0">
                      <div className="flex items-center text-sm">
                        <span className="font-medium truncate">{messageUser?.name}</span>
                        <span className="mx-1 text-gray-500">in</span>
                        <span className="font-medium text-indigo-600">#{channel?.name}</span>
                        <span className="ml-auto text-xs text-gray-500 whitespace-nowrap">
                          {formatTimeAgo(message.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No recent activity to show.
          </div>
        )}
      </div>
      
      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/channel/1')}
              className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Hash size={24} className="text-indigo-600 mb-2" />
              <span className="text-sm font-medium">General Channel</span>
            </button>
            
            <button 
              onClick={() => navigate('/organization-chart')}
              className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <BarChart2 size={24} className="text-indigo-600 mb-2" />
              <span className="text-sm font-medium">Org Chart</span>
            </button>
            
            <button 
              onClick={() => navigate('/admin')}
              className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <Users size={24} className="text-indigo-600 mb-2" />
              <span className="text-sm font-medium">Admin Panel</span>
            </button>
            
            <button 
              onClick={() => navigate('/profile')}
              className="flex flex-col items-center justify-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              <FileText size={24} className="text-indigo-600 mb-2" />
              <span className="text-sm font-medium">Your Profile</span>
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Upcoming</h2>
          
          <div className="space-y-4">
            <div className="flex items-start p-3 border border-gray-200 rounded-lg">
              <Clock size={20} className="text-indigo-600 mt-0.5 mr-3" />
              <div>
                <p className="font-medium">Weekly Team Sync</p>
                <p className="text-sm text-gray-500">Tomorrow at 10:00 AM</p>
                <div className="flex mt-2">
                  {users?.length > 0 && (
                    
                    <Avatar src={users[0].avatar} alt={users[0].name} size="small" />
                  )}
                  {/* <Avatar src={users[1].avatar} alt={users[1].name} size="small" /> */}
                  {/* <Avatar src={users[2].avatar} alt={users[2].name} size="small" /> */}
                </div>
              </div>
            </div>
            
            <div className="flex items-start p-3 border border-gray-200 rounded-lg">
              <Clock size={20} className="text-indigo-600 mt-0.5 mr-3" />
              <div>
                <p className="font-medium">Product Review</p>
                <p className="text-sm text-gray-500">Friday at 2:00 PM</p>
                <div className="flex mt-2">
                  {users?.length > 0 && (

                  <Avatar src={users[1].avatar} alt={users[1].name} size="small" />
                  )}
                  {/* <Avatar src={users[2].avatar} alt={users[2].name} size="small" /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;