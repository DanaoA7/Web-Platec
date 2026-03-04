'use client';

import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchAdminProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const response = await api.get('/admin/profile');
      setAdmin(response.data);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const loginAdmin = async (email, password) => {
    // backend mounts admin routes under /api/admin, so the full
    // path for login is /api/admin/login (baseURL already includes
    // /api). Previous code used `/adminlogin` which resulted in a
    // missing route and confusing 500 errors.
    const response = await api.post('/admin/login', { email, password });
    localStorage.setItem('token', response.data.token);
    setAdmin(response.data.admin);
    return response.data;
  };



  const registerAdmin = async (fullName, email, password) => {
    // send full name to backend to populate the admin table
    const response = await api.post('/admin/register', { full_name: fullName, email, password });
    // store token and update context state exactly like login
    localStorage.setItem('token', response.data.token);
    setAdmin(response.data.admin);
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, loginAdmin,registerAdmin,  logout }}>
      {children}
    </AuthContext.Provider>
  );
};
