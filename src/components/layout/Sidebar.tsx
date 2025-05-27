import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Hash, 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  MessageSquare,
  BarChart2,
  Users,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import CreateChannelModal from '../modals/CreateChannelModal';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const { channels, users, currentWorkspace } = useWorkspace();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [showChannels, setShowChannels] = useState(true);
  const [showDirectMessages, setShowDirectMessages] = useState(true);
  const [createChannelOpen, setCreateChannelOpen] = useState(false);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const otherUsers = users.filter(u => u.id !== user?.id);

  return (
    <>
      <div
        className={`bg-indigo-900 text-white transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        } flex flex-col h-full`}
      >
        {/* Workspace Header */}
        <div className="px-4 h-14 flex items-center border-b border-indigo-800">
          {!collapsed ? (
            <h1 className="text-xl font-bold truncate">
              {currentWorkspace?.name || 'TrunkChart'}
            </h1>
          ) : (
            <div className="w-full flex justify-center">
              <span className="font-bold text-xl">TC</span>
            </div>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto py-2">
          {/* Channels */}
          <div className="mb-4">
            <div
              className="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-indigo-800"
              onClick={() => setShowChannels(!showChannels)}
            >
              <div className="flex items-center">
                {showChannels ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                {!collapsed && <span className="ml-1 text-sm font-medium">Channels</span>}
              </div>
              {!collapsed && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCreateChannelOpen(true);
                  }}
                  className="text-indigo-300 hover:text-white"
                >
                  <Plus size={16} />
                </button>
              )}
            </div>
            
            {showChannels && (
              <div className="mt-1">
                {channels.map((channel) => (
                  <NavLink
                    key={channel.id}
                    to={`/channel/${channel.id}`}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 ${
                        isActive ? 'bg-indigo-800' : 'hover:bg-indigo-800'
                      } ${collapsed ? 'justify-center' : ''}`
                    }
                  >
                    <Hash size={18} />
                    {!collapsed && (
                      <span className="ml-2 truncate">{channel.name}</span>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Direct Messages */}
          <div className="mb-4">
            <div
              className="px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-indigo-800"
              onClick={() => setShowDirectMessages(!showDirectMessages)}
            >
              <div className="flex items-center">
                {showDirectMessages ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                {!collapsed && <span className="ml-1 text-sm font-medium">Direct Messages</span>}
              </div>
            </div>
            
            {showDirectMessages && (
              <div className="mt-1">
                {otherUsers.map((user) => (
                  <NavLink
                    key={user.id}
                    to={`/dm/${user.id}`}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 ${
                        isActive ? 'bg-indigo-800' : 'hover:bg-indigo-800'
                      } ${collapsed ? 'justify-center' : ''}`
                    }
                  >
                    {collapsed ? (
                      <Avatar src={user.avatar} size="small" alt={user.name} />
                    ) : (
                      <>
                        <Avatar src={user.avatar} size="small" alt={user.name} />
                        <span className="ml-2 truncate">{user.name}</span>
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* Extra Navigation */}
          {!collapsed && (
            <div className="px-4 py-2">
              {/* <h3 className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
                Tools
              </h3>
              <NavLink
                to="/organization-chart"
                className={({ isActive }) =>
                  `flex items-center px-2 py-2 mt-1 rounded ${
                    isActive ? 'bg-indigo-800' : 'hover:bg-indigo-800'
                  }`
                }
              >
                <BarChart2 size={18} />
                <span className="ml-2">Organization Chart</span>
              </NavLink> */}
              
              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `flex items-center px-2 py-2 mt-1 rounded ${
                      isActive ? 'bg-indigo-800' : 'hover:bg-indigo-800'
                    }`
                  }
                >
                  <Users size={18} />
                  <span className="ml-2">Admin Panel</span>
                </NavLink>
              )}
            </div>
          )}

          {/* Collapsed Navigation */}
          {collapsed && (
            <div className="flex flex-col items-center mt-4 space-y-4">
              <NavLink
                to="/organization-chart"
                className={({ isActive }) =>
                  `p-2 rounded ${isActive ? 'bg-indigo-800' : 'hover:bg-indigo-800'}`
                }
              >
                <BarChart2 size={20} />
              </NavLink>
              
              {user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `p-2 rounded ${isActive ? 'bg-indigo-800' : 'hover:bg-indigo-800'}`
                  }
                >
                  <Users size={20} />
                </NavLink>
              )}
            </div>
          )}
        </div>

        {/* User Section */}
        <div className="p-4 border-t border-indigo-800">
          <div className="flex items-center">
            <NavLink to="/profile">
              <Avatar src={user?.avatar} alt={user?.name || 'User'} />
            </NavLink>
            
            {!collapsed && (
              <div className="ml-3 overflow-hidden">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-indigo-300 truncate">{user?.title}</p>
              </div>
            )}
            
            {!collapsed && (
              <button
                onClick={handleLogout}
                className="ml-auto text-indigo-300 hover:text-white"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
          
          {collapsed && (
            <button
              onClick={handleLogout}
              className="mt-4 text-indigo-300 hover:text-white flex justify-center w-full"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </div>
      
      <CreateChannelModal
        isOpen={createChannelOpen}
        onClose={() => setCreateChannelOpen(false)}
      />
    </>
  );
};

export default Sidebar;