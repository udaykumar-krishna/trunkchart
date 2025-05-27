import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Hash, 
  Search, 
  Plus, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Users,
  ArrowLeft,
  Shield
} from 'lucide-react';

const ChannelManagement: React.FC = () => {
  const { channels, users } = useWorkspace();
  const { user: currentUser } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  
  // Check if user is admin
  if (currentUser?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-3.5rem)]">
        <div className="text-center">
          <Shield size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700">Access Denied</h2>
          <p className="text-gray-500 max-w-md mx-auto mt-2">
            You don't have permission to access this page.
          </p>
          <Link
            to="/admin"
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 inline-block"
          >
            Back to Admin Panel
          </Link>
        </div>
      </div>
    );
  }
  
  // Filter channels based on search
  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    channel.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Toggle channel selection
  const toggleSelectChannel = (channelId: string) => {
    if (selectedChannels.includes(channelId)) {
      setSelectedChannels(selectedChannels.filter(id => id !== channelId));
    } else {
      setSelectedChannels([...selectedChannels, channelId]);
    }
  };
  
  // Select/deselect all channels
  const toggleSelectAll = () => {
    if (selectedChannels.length === filteredChannels.length) {
      setSelectedChannels([]);
    } else {
      setSelectedChannels(filteredChannels.map(channel => channel.id));
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin" className="text-indigo-600 hover:text-indigo-800 flex items-center mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Back to Admin Panel
        </Link>
        
        <h1 className="text-2xl font-bold mb-1">Channel Management</h1>
        <p className="text-gray-600">Manage channels, permissions, and channel settings</p>
      </div>
      
      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search channels..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <div className="flex gap-2">
            <button 
              disabled={selectedChannels.length === 0}
              className={`px-3 py-2 rounded-md flex items-center justify-center ${
                selectedChannels.length > 0 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Trash2 size={18} className="mr-1" />
              <span className="hidden sm:inline">Delete</span>
            </button>
            
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md flex items-center justify-center">
              <Plus size={18} className="mr-1" />
              <span className="hidden sm:inline">Add Channel</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Channels Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      checked={selectedChannels.length === filteredChannels.length && filteredChannels.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Channel
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Members
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visibility
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredChannels.map((channel) => {
                const creator = users.find(u => u.id === channel.createdBy);
                
                return (
                  <tr key={channel.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          checked={selectedChannels.includes(channel.id)}
                          onChange={() => toggleSelectChannel(channel.id)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Hash className="text-gray-500 mr-2" size={18} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{channel.name}</div>
                          <div className="text-sm text-gray-500">{channel.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{creator?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(channel.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {channel.members.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        channel.isPrivate 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {channel.isPrivate ? 'Private' : 'Public'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button 
                          onClick={() => setShowActionMenu(showActionMenu === channel.id ? null : channel.id)}
                          className="text-gray-500 hover:text-indigo-600"
                        >
                          <MoreVertical size={18} />
                        </button>
                        
                        {showActionMenu === channel.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 py-1">
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                              <Edit size={16} className="mr-2" />
                              Edit Channel
                            </button>
                            
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                              <Users size={16} className="mr-2" />
                              Manage Members
                            </button>
                            
                            <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                              {channel.isPrivate ? (
                                <>
                                  <Eye size={16} className="mr-2" />
                                  Make Public
                                </>
                              ) : (
                                <>
                                  <EyeOff size={16} className="mr-2" />
                                  Make Private
                                </>
                              )}
                            </button>
                            
                            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
                              <Trash2 size={16} className="mr-2" />
                              Delete Channel
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {filteredChannels.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    <Hash size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-lg font-medium">No channels found</p>
                    <p className="text-sm">Try adjusting your search to find channels.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChannelManagement;