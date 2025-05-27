import React, { useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { Hash, Search, Menu, Bell, HelpCircle, Settings, User } from 'lucide-react';
import Avatar from '../ui/Avatar';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarCollapsed }) => {
  const { channels, users } = useWorkspace();
  const { user } = useAuth();
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Determine current page title
  const getPageTitle = () => {
    if (location.pathname === '/') {
      return 'Dashboard';
    }
    
    if (location.pathname.startsWith('/channel/')) {
      const channelId = params.channelId;
      const channel = channels.find(c => c.id === channelId);
      return channel ? `#${channel.name}` : 'Channel';
    }
    
    if (location.pathname.startsWith('/dm/')) {
      const userId = params.userId;
      const chatUser = users.find(u => u.id === userId);
      return chatUser ? chatUser.name : 'Direct Message';
    }
    
    if (location.pathname === '/organization-chart') {
      return 'Organization Chart';
    }
    
    if (location.pathname.startsWith('/admin')) {
      return 'Admin Panel';
    }
    
    if (location.pathname === '/profile') {
      return 'Your Profile';
    }
    
    return 'TrunkChart';
  };

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-4 justify-between">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-indigo-600 mr-4"
        >
          <Menu size={20} />
        </button>
        
        <div className="font-medium text-lg flex items-center">
          {location.pathname.startsWith('/channel/') && <Hash className="mr-1" size={20} />}
          {getPageTitle()}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-100 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white w-56 md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
        </div>
        
        <button className="text-gray-500 hover:text-indigo-600 relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 text-xs text-white flex items-center justify-center">
            3
          </span>
        </button>
        
        <button className="text-gray-500 hover:text-indigo-600">
          <HelpCircle size={20} />
        </button>
        
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2"
          >
            <Avatar 
              src={user?.avatar} 
              alt={user?.name || 'User'} 
              size="small" 
            />
          </button>
          
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              
              <button 
                onClick={() => {
                  navigate('/profile');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <User size={16} className="mr-2" />
                Your Profile
              </button>
              
              <button 
                onClick={() => {
                  navigate('/admin');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <Settings size={16} className="mr-2" />
                Preferences
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;