import axios from 'axios';
import * as SecureStore from 'expo-secure-store';


const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api';
// const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.3:5000/api'; 
console.log("API URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('student_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('student_token');
      await SecureStore.deleteItemAsync('student_id');
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  studentLogin: (email, password) =>
    api.post('/student-auth/login', { email, password }),
  studentRegister: (registrationData) =>
    api.post('/student-auth/register', registrationData),
};

export const studentAPI = {
  getProfile: () => api.get('/student-auth/profile'),
  getAttendance: (params) => api.get('/student-auth/attendance', { params }),
  getAttendanceHistory: (params) => api.get('/student-auth/attendance/history', { params }),
};

export const notificationAPI = {
  getNotifications: () => api.get('/student-auth/notifications'),
  markNotificationAsRead: (notificationId) =>
    api.put(`/student-auth/notifications/${notificationId}/read`),
};

export default api;
