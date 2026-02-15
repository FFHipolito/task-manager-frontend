import axios, { AxiosInstance } from 'axios';
import type { LoginRequest, RegisterRequest, AuthResponse, Task, ForgotPasswordRequest, ResetPasswordRequest } from '@/types';

const getBaseURL = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://task-manager-backend-theta-lime.vercel.app';
  }
  
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

const API_URL = getBaseURL();

console.log('🌍 Ambiente:', process.env.NODE_ENV);
console.log('🌐 API URL configurada:', API_URL);

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  console.log('📤 Requisição sendo feita:', {
    url: config.url,
    method: config.method,
    baseURL: config.baseURL,
    fullURL: `${config.baseURL}${config.url}`,
    data: config.data
  });
  
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('📥 Resposta recebida:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ Erro na requisição:', {
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      fullURL: error.config?.baseURL + error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: RegisterRequest) => api.post<AuthResponse>('/auth/register', data),
  login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),
  me: () => api.get('/auth/me'),
  forgotPassword: (data: ForgotPasswordRequest) => api.post('/auth/forgot-password', data),
  resetPassword: (data: ResetPasswordRequest) => api.post('/auth/reset-password', data),
};

export const tasksAPI = {
  getAll: () => api.get<Task[]>('/tasks'),
  getOne: (id: string) => api.get<Task>(`/tasks/${id}`),
  create: (data: Partial<Task>) => api.post<Task>('/tasks', data),
  update: (id: string, data: Partial<Task>) => api.put<Task>(`/tasks/${id}`, data),
  delete: (id: string) => api.delete(`/tasks/${id}`),
};

export default api;