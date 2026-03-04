'use client';

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import '../styles/dashboard.css';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { admin } = useContext(AuthContext);
  const [stats, setStats] = useState({ teachers: 0, students: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');

      // Get teachers count
      const teachersRes = await fetch('http://localhost:5000/api/admin/teachers', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const teachers = await teachersRes.json();

      // Get students count
      const studentsRes = await fetch('http://localhost:5000/api/admin/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const students = await studentsRes.json();

      // Get pending approvals count
      const pendingRes = await fetch('http://localhost:5000/api/admin/students/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const pending = await pendingRes.json();

      setStats({
        teachers: teachers.length || 0,
        students: students.length || 0,
        pending: pending.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Manage Teachers',
      description: 'Create and manage teacher accounts',
      icon: '👨‍🏫',
      action: () => navigate('/teachers'),
    },
    {
      title: 'Approve Students',
      description: 'Review and approve student registrations',
      icon: '✅',
      action: () => navigate('/student-approvals'),
    },
    {
      title: 'Mark Attendance',
      description: 'Record daily attendance',
      icon: '📋',
      action: () => navigate('/attendance'),
    },
    {
      title: 'View Reports',
      description: 'Attendance reports and analytics',
      icon: '📊',
      action: () => navigate('/reports'),
    },
  ];

  return (
    <Layout>
      <div className="dashboard-content">
        <div className="welcome-section">
          <div className="welcome-banner">
            <h1>Welcome Back, {admin?.full_name}!</h1>
            <p>Manage teachers, approve students, and track attendance</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👨‍🏫</div>
            <div className="stat-content">
              <p className="stat-label">Teachers</p>
              <p className="stat-value">{loading ? '-' : stats.teachers}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <p className="stat-label">Approved Students</p>
              <p className="stat-value">{loading ? '-' : stats.students}</p>
            </div>
          </div>

          <div className="stat-card highlight">
            <div className="stat-icon">⏳</div>
            <div className="stat-content">
              <p className="stat-label">Pending Approvals</p>
              <p className="stat-value">{loading ? '-' : stats.pending}</p>
            </div>
          </div>
        </div>

       

        
      </div>
    </Layout>
  );
}
