'use client';


import React, { useState, useContext } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import '../styles/auth.css';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { loginAdmin } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      const msg = 'Email and password are required';
      toast.error(msg);
      setError(msg);
      return;
    }

    setLoading(true);
    try {
      await loginAdmin(email, password);
      toast.success('Login successful');
      navigate('/reports');
    } catch (err) {
      const serverMsg = err.response?.data?.error || err.response?.data?.message;
      const msg = serverMsg || err.message || 'Login failed';
      toast.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
            <div className="auth-logo">
          <img src="/logow_bg.png" alt="Nurture Academy" />
           {/* <h1>
    <span className="nurture">NURTURE</span>{' '}
    <span className="academy">ACADEMY</span>
  </h1> */}
        </div>

        <h2 className="auth-title">Admin Login Portal</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
            <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-with-icon">
              {/* <span className="icon">✉️</span> */}
           <img src="/email.png" alt="icon" className="icon" />
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              {/* <span className="icon">🔒</span> */}
              <img src="/password.png" alt="icon" className="icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁' : '👁‍🗨'}
              </button> */}
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
               {showPassword ? '👁' : '👁‍🗨'}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>



         <p className="auth-link">
          Don't have an account?{' '}
          <Link to="/registeradmin" className="link">
            Register
          </Link>
        </p>

        <p className="auth-footer">Admin credentials required</p>
      </div>
    </div>
  );
  }

