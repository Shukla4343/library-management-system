import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

const apiService = {
  // Auth endpoints
  async login(credentials: { username: string; password: string }) {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success) {
      const { accessToken, refreshToken, user } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
  },

  async register(credentials: { username: string; password: string; role?: string }) {
    const response = await api.post('/auth/register', credentials);
    if (response.data.success) {
      const { accessToken, refreshToken, user } = response.data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
  },

  async logout() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      await api.post('/auth/logout', { refreshToken }).catch(() => {});
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Book endpoints
  async getBooks(params?: { page?: number; limit?: number; search?: string; status?: string }) {
    const response = await api.get('/books', { params });
    return response.data;
  },

  async getBookById(id: string) {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  async createBook(bookData: any) {
    const response = await api.post('/books', bookData);
    return response.data;
  },

  async updateBook(id: string, bookData: any) {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  },

  async deleteBook(id: string) {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  },

  async borrowBook(id: string) {
    const response = await api.patch(`/books/${id}/borrow`);
    return response.data;
  },

  async returnBook(id: string) {
    const response = await api.patch(`/books/${id}/return`);
    return response.data;
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

export default apiService;