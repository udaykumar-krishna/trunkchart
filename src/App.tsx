import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Channel from './pages/Channel';
import DirectMessage from './pages/DirectMessage';
import OrganizationChart from './pages/OrganizationChart';
import AdminPanel from './pages/admin/AdminPanel';
import UserManagement from './pages/admin/UserManagement';
import ChannelManagement from './pages/admin/ChannelManagement';
import UserProfile from './pages/UserProfile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from './components/ui/Toaster';
import WorkspaceSettings from './pages/admin/WorkspaceSettings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <WorkspaceProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected routes with AppLayout */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="channel/:channelId" element={<Channel />} />
              <Route path="dm/:userId" element={<DirectMessage />} />
              <Route path="organization-chart" element={<OrganizationChart />} />
              <Route path="profile" element={<UserProfile />} />
              <Route path="admin" element={<AdminPanel />} />
              <Route path="admin/users" element={<UserManagement />} />
              <Route path="admin/channels" element={<ChannelManagement />} />
              <Route path="admin/workspaces/general-settings" element={<WorkspaceSettings />}/>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
          <Toaster />
        </WorkspaceProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;