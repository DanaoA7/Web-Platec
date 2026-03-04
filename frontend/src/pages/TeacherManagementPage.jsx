
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import AddTeacherModal from '../components/AddTeacherModal';
import '../styles/dashboard.css';
import '../styles/modal.css';
import '../styles/teachers.css';

export default function TeacherManagementPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/teachers', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch teachers');

      const data = await response.json();
      setTeachers(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherAdded = () => {
    setShowModal(false);
    fetchTeachers();
  };

  const handleDeleteTeacher = async (id) => {
    if (!window.confirm('Are you sure you want to delete this teacher?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/teachers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to delete teacher');

      setTeachers(teachers.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeTeachers = teachers.filter((t) => t.is_active);
  const inactiveTeachers = teachers.filter((t) => !t.is_active);

  return (
    <Layout>
      <div className="teachers-page">
        {/* Header */}
        <div className="teachers-header">
          <div className="header-content">
            <h1>Teacher Management</h1>
            <p className="header-subtitle">Create and manage teacher accounts</p>
          </div>
          <button className="btn-add-teacher" onClick={() => setShowModal(true)}>
             Add New Teacher
          </button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Statistics */}
        <div className="teachers-stats">
          <div className="stat-box">
            <span className="stat-number">{teachers.length}</span>
            <span className="stat-label">Total Teachers</span>
          </div>
          <div className="stat-box active">
            <span className="stat-number">{activeTeachers.length}</span>
            <span className="stat-label">Active</span>
          </div>
          <div className="stat-box inactive">
            <span className="stat-number">{inactiveTeachers.length}</span>
            <span className="stat-label">Inactive</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="teachers-search">
          <input
            type="text"
            placeholder="Search teachers by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Content */}
        <div className="teachers-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading teachers...</p>
            </div>
          ) : filteredTeachers.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👨‍🏫</div>
              <h3>No teachers found</h3>
              <p>{searchTerm ? 'No teachers match your search' : 'Create your first teacher account to get started'}</p>
              {!searchTerm && (
                <button className="btn-empty-action" onClick={() => setShowModal(true)}>
                  Add Teacher
                </button>
              )}
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="teachers-table">
                <thead>
                  <tr>
                    <th>Teacher ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Department</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeachers.map((teacher) => (
                    <tr key={teacher.id}>
                      <td data-label="Teacher ID">
                        <span className="teacher-id">{teacher.teacher_id}</span>
                      </td>
                      <td data-label="Full Name">{teacher.full_name}</td>
                      <td data-label="Email">{teacher.email}</td>
                      <td data-label="Department">{teacher.department || '—'}</td>
                      <td data-label="Phone">{teacher.phone || '—'}</td>
                      <td data-label="Status">
                        <span className={`status-badge ${teacher.is_active ? 'status-active' : 'status-inactive'}`}>
                          {teacher.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td data-label="Actions">
                        <button
                          className="btn-action btn-delete"
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          title="Delete teacher"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showModal && <AddTeacherModal onClose={() => setShowModal(false)} onSuccess={handleTeacherAdded} />}
      </div>
    </Layout>
  );
}
