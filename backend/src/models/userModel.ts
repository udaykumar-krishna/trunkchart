export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    avatar: string;
    role: 'admin' | 'user' | 'member';
    title: string;
    department: string;
    status: 'active' | 'inactive';
  }
  