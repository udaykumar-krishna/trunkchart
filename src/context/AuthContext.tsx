import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
// const mockUsers:User[] = [
//   {
//     id: '1',
//     name: 'Admin User',
//     email: 'admin@trunkchart.com',
//     avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
//     role: 'admin',
//     title: 'CEO',
//     department: 'Executive',
//     status: 'active',
//   },
//   {
//     id: '2',
//     name: 'Jane Smith',
//     email: 'jane@trunkchart.com',
//     avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
//     role: 'user',
//     title: 'Marketing Director',
//     department: 'Marketing',
//     status: 'active',
//   },
//   {
//     id: '3',
//     name: 'Bob Johnson',
//     email: 'bob@trunkchart.com',
//     avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
//     role: 'user',
//     title: 'Software Engineer',
//     department: 'Engineering',
//     status: 'active',
//   },
// ];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user data on component mount
    const storedUser = localStorage.getItem('trunkchat_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.role == 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/login/', {
        method: 'POST',
        credentials: 'include',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password})
      });
      console.log("login response: ",response)
      if (!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to login');
      }

      const data = await response.json()
      console.log("login data: ",data)
      const loggedInUser:User = {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar || `https://ui-avatars.com/api/?name=${data.name.replace(' ', '+')}&background=random`,
        role: data.role || 'user',
        title: data.title || 'Team Member',
        department: data.department || 'General',
        status: data.status || 'active',
      }
      setUser(loggedInUser);
      console.log("logged in user: ",loggedInUser)
      localStorage.setItem('trunkchat_user', JSON.stringify(loggedInUser));
      return loggedInUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to signup');
      }
  
      const data = await response.json();
  
      const newUser: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar: data.avatar || `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random`,
        role: data.role || 'user',
        title: data.title || 'Team Member',
        department: data.department || 'General',
        status: data.status || 'active',
      };
  
      localStorage.setItem('trunkchat_user', JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout',{
        method: 'POST',
        credentials: 'include', 
      })
      localStorage.removeItem('trunkchat_user')
    } catch (error) {
      console.error('Logout error: ',error);
    } finally {
      setUser(null);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...userData };
    localStorage.setItem('trunkchart_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};