export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  createdAt?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  status: 'available' | 'borrowed';
  publishedYear: number;
  borrowedBy?: {
    id: string;
    username: string;
  } | null;
  borrowedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  role?: 'admin' | 'user';
}

export interface BookFormData {
  title: string;
  author: string;
  publishedYear: number;
  status?: 'available' | 'borrowed';
}