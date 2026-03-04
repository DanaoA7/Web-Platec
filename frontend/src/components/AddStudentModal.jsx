'use client';

import React, { useState } from 'react';
import '../styles/modal.css';

const AddStudentModal = ({
  onClose,
  onAdd,
  programs,
  yearLevels,
  sections,
}) => {
  const [formData, setFormData] = useState({
    studentId: '',
    fullName: '',
    email: '',
    programId: '',
    yearLevelId: '',
    sectionId: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (
      !formData.studentId ||
      !formData.fullName ||
      !formData.email ||
      !formData.programId ||
      !formData.yearLevelId ||
      !formData.sectionId
    ) {
      setError('All fields are required');
      return;
    }

    setLoading(true);

    try {
      await onAdd({
        studentId: formData.studentId,
        fullName: formData.fullName,
        email: formData.email,
        programId: parseInt(formData.programId),
        yearLevelId: parseInt(formData.yearLevelId),
        sectionId: parseInt(formData.sectionId),
      });
    } catch (err) {
      setError(err.message || 'Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal open">
      <div className="modal-content">
        <h2>Add New Student</h2>

        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="studentId">Student ID</label>
            <input
              id="studentId"
              name="studentId"
              type="text"
              placeholder="Enter Student ID"
              value={formData.studentId}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="programId">Program</label>
            <select
              id="programId"
              name="programId"
              value={formData.programId}
              onChange={handleChange}
              required
            >
              <option value="">Select Program</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="yearLevelId">Year Level</label>
            <select
              id="yearLevelId"
              name="yearLevelId"
              value={formData.yearLevelId}
              onChange={handleChange}
              required
            >
              <option value="">Select Year Level</option>
              {yearLevels.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.level}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="sectionId">Section</label>
            <select
              id="sectionId"
              name="sectionId"
              value={formData.sectionId}
              onChange={handleChange}
              required
            >
              <option value="">Enter section</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Adding...' : '+ Add Student'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStudentModal;
