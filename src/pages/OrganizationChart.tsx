import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Users, Search, Filter, Download } from 'lucide-react';
import Avatar from '../components/ui/Avatar';

const OrganizationChart: React.FC = () => {
  const { users } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  
  // Get unique departments
  const departments = ['all', ...Array.from(new Set(users.map(user => user.department)))];
  
  // Filter users based on search and department
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesDepartment = filterDepartment === 'all' || user.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });
  
  // Group users by department for the chart view
  const usersByDepartment: Record<string, typeof users> = {};
  filteredUsers.forEach(user => {
    if (!usersByDepartment[user.department]) {
      usersByDepartment[user.department] = [];
    }
    usersByDepartment[user.department].push(user);
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Organization Chart</h1>
        <p className="text-gray-600">View and explore your team's structure</p>
      </div>
      
      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name, title, or email"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <div className="relative sm:w-64">
            <select
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departments.filter(d => d !== 'all').map(department => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
            <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
          </div>
          
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center sm:w-auto">
            <Download size={18} className="mr-2" />
            Export
          </button>
        </div>
      </div>
      
      {/* Organization Chart */}
      <div className="space-y-6">
        {Object.entries(usersByDepartment).map(([department, departmentUsers]) => (
          <div key={department} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 bg-indigo-700 text-white">
              <div className="flex items-center">
                <Users className="mr-2" size={18} />
                <h2 className="text-lg font-semibold">{department}</h2>
                <span className="ml-auto bg-indigo-800 text-xs px-2 py-1 rounded-full">
                  {departmentUsers.length} members
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {departmentUsers.map(user => (
                <div key={user.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <Avatar 
                      src={user.avatar} 
                      alt={user.name}
                      size="large"
                      status={user.id === '1' ? 'online' : user.id === '2' ? 'away' : 'offline'}
                    />
                    <div className="ml-3">
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.title}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Email:</span>
                      <span className="text-gray-800">{user.email}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Department:</span>
                      <span className="text-gray-800">{user.department}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span className="font-medium mr-2">Role:</span>
                      <span className="text-gray-800 capitalize">{user.role}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      View Profile
                    </button>
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {Object.keys(usersByDepartment).length === 0 && (
          <div className="bg-white rounded-lg shadow p-10 text-center">
            <Users size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-700">No users found</h3>
            <p className="text-gray-500 max-w-md mx-auto mt-2">
              Try adjusting your search or filter to find users in the organization.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizationChart;