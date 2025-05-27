import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Hash, 
  Settings, 
  Shield, 
  FileText, 
  BarChart2,
  Activity,
  ArrowRight
} from 'lucide-react';

const AdminPanel: React.FC = () => {
  const { channels, users } = useWorkspace();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <div className="text-center">
          <Shield size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">Access Denied</h2>
          <p className="text-gray-500 max-w-md mx-auto mt-2">
            You don't have permission to access the admin panel.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Admin Panel</h1>
        <p className="text-gray-600">Manage your workspace settings and users</p>
      </div>
      
      {/* Admin Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Users Management Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-indigo-700 text-white">
            <div className="flex items-center">
              <Users className="mr-2" size={18} />
              <h2 className="text-lg font-semibold">Users</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Total Users</span>
              <span className="text-2xl font-bold">{users.length}</span>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm">Admins</span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
                  {users.filter(u => u.role === 'admin').length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Regular Users</span>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                  {users.filter(u => u.role === 'user').length}
                </span>
              </div>
            </div>
            
            <Link
              to="/admin/users"
              className="w-full flex items-center justify-between px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100"
            >
              <span className="font-medium">Manage Users</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        
        {/* Channels Management Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-indigo-700 text-white">
            <div className="flex items-center">
              <Hash className="mr-2" size={18} />
              <h2 className="text-lg font-semibold">Channels</h2>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Total Channels</span>
              <span className="text-2xl font-bold">{channels.length}</span>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm">Public Channels</span>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  {channels.filter(c => !c.isPrivate).length}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Private Channels</span>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                  {channels.filter(c => c.isPrivate).length}
                </span>
              </div>
            </div>
            
            <Link
              to="/admin/channels"
              className="w-full flex items-center justify-between px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100"
            >
              <span className="font-medium">Manage Channels</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
        
        {/* Workspace Settings Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-indigo-700 text-white">
            <div className="flex items-center">
              <Settings className="mr-2" size={18} />
              <h2 className="text-lg font-semibold">Workspace Settings</h2>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 mb-6">
              Configure workspace settings, permissions, and integrations.
            </p>
            
            <div className="space-y-4">
              <Link 
                to="/admin/workspaces/general-settings"
                className="w-full flex items-center justify-between px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100">
                <span className="font-medium">General Settings</span>
                <ArrowRight size={18} />
              </Link>
              
              <button className="w-full flex items-center justify-between px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100">
                <span className="font-medium">Permissions</span>
                <ArrowRight size={18} />
              </button>
              
              <button className="w-full flex items-center justify-between px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100">
                <span className="font-medium">Integrations</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Analytics Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-indigo-700 text-white">
            <div className="flex items-center">
              <BarChart2 className="mr-2" size={18} />
              <h2 className="text-lg font-semibold">Analytics</h2>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              View usage statistics and analytics for your workspace.
            </p>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Users (Last 7 days)</span>
                <span className="font-medium">{users.length}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Messages Sent (Last 7 days)</span>
                <span className="font-medium">48</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Files Shared (Last 7 days)</span>
                <span className="font-medium">12</span>
              </div>
            </div>
            
            <button className="w-full flex items-center justify-between px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100">
              <span className="font-medium">View Detailed Analytics</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        
        {/* Activity Logs Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-indigo-700 text-white">
            <div className="flex items-center">
              <Activity className="mr-2" size={18} />
              <h2 className="text-lg font-semibold">Activity Logs</h2>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Monitor admin activities and system events.
            </p>
            
            <div className="space-y-3 mb-6 text-sm">
              <div className="p-2 bg-gray-50 rounded">
                <span className="font-medium">Admin User</span> added a new channel <span className="font-medium">#marketing</span>
                <div className="text-xs text-gray-500 mt-1">3 hours ago</div>
              </div>
              
              <div className="p-2 bg-gray-50 rounded">
                <span className="font-medium">System</span> performed automatic backup
                <div className="text-xs text-gray-500 mt-1">12 hours ago</div>
              </div>
              
              <div className="p-2 bg-gray-50 rounded">
                <span className="font-medium">Admin User</span> updated user permissions
                <div className="text-xs text-gray-500 mt-1">1 day ago</div>
              </div>
            </div>
            
            <button className="w-full flex items-center justify-between px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100">
              <span className="font-medium">View All Activity</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
        
        {/* Documentation Card */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-indigo-700 text-white">
            <div className="flex items-center">
              <FileText className="mr-2" size={18} />
              <h2 className="text-lg font-semibold">Documentation</h2>
            </div>
          </div>
          
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Access guides and documentation for administrators.
            </p>
            
            <div className="space-y-3 mb-6">
              <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded flex items-center">
                <span className="text-sm">Admin Guide</span>
                <ArrowRight size={14} className="ml-auto" />
              </button>
              
              <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded flex items-center">
                <span className="text-sm">User Management</span>
                <ArrowRight size={14} className="ml-auto" />
              </button>
              
              <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded flex items-center">
                <span className="text-sm">Security Best Practices</span>
                <ArrowRight size={14} className="ml-auto" />
              </button>
              
              <button className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded flex items-center">
                <span className="text-sm">Troubleshooting</span>
                <ArrowRight size={14} className="ml-auto" />
              </button>
            </div>
            
            <button className="w-full flex items-center justify-between px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100">
              <span className="font-medium">View All Documentation</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;