'use client';

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/layout.css';

const Layout = ({ children }) => {
  const { admin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="layout-container">
      <header className="header">
  {/* Top row: Logo + admin info + logout */}
  <div className="header-top">
    <div className="header-left">
      <div className="logo">
        <img src="/bg.png" alt="Nurture Academy" />
        <h1>
          <span className="nurture">NURTURE</span>{' '}
          <span className="academy">ACADEMY</span>
        </h1>
      </div>
    </div>

    <div className="header-right">
      {admin && (
        <>
          <span className="admin-name">{admin.full_name}</span>
          <span className="admin-role">Admin Portal</span>
        </>
      )}
      <button className="btn-logout" onClick={handleLogout}>
        Logout
      </button>
    </div>
  </div>

  {/* Bottom row: Navigation tabs */}
  <nav className="nav-tabs">
    {/* <Link to="/dashboard" className="nav-link">
      Dashboard
    </Link>
    <Link to="/teachers" className="nav-link">
      Teachers
    </Link> */}
    <Link to="/student-approvals" className="nav-link">
      Student Approvals
    </Link>
    <Link to="/attendance" className="nav-link">
      Attendance
    </Link>
    <Link to="/reports" className="nav-link">
      Reports
    </Link>
  </nav>
</header>

      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;
