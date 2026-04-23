import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // Ensure the role is properly typed
        if (parsedUser.role === 'admin' || parsedUser.role === 'user') {
          setUser(parsedUser);
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          // Determine role based on username (for demo purposes)
          let role: 'admin' | 'user' = 'user';
          if (username.toLowerCase() === 'admin') {
            role = 'admin';
          }
          
          const newUser: User = {
            id: Date.now().toString(),
            username: username,
            role: role
          };
          
          localStorage.setItem('user', JSON.stringify(newUser));
          localStorage.setItem('isAuthenticated', 'true');
          setUser(newUser);
          toast.success('Login successful!');
          setIsLoading(false);
          resolve();
        }, 500);
      });
    } catch (error) {
      toast.error('Login failed');
      setIsLoading(false);
      throw error;
    }
  };

  const register = async (username: string, password: string, role: string = 'user') => {
    setIsLoading(true);
    try {
      // Simulate API call
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          // Ensure role is either 'admin' or 'user'
          const userRole: 'admin' | 'user' = role === 'admin' ? 'admin' : 'user';
          
          const newUser: User = {
            id: Date.now().toString(),
            username: username,
            role: userRole
          };
          
          localStorage.setItem('user', JSON.stringify(newUser));
          localStorage.setItem('isAuthenticated', 'true');
          setUser(newUser);
          toast.success('Registration successful!');
          setIsLoading(false);
          resolve();
        }, 500);
      });
    } catch (error) {
      toast.error('Registration failed');
      setIsLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};