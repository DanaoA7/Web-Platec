'use client';

import React, { useState } from 'react';

const AttendanceTable = ({ attendance, onMarkAttendance }) => {
  const [updatingId, setUpdatingId] = useState(null);

  const handleStatusChange = async (studentId, status) => {
    setUpdatingId(studentId);
    try {
      await onMarkAttendance(studentId, status);
    } finally {
      setUpdatingId(null);
    }
  };

  if (attendance.length === 0) {
    return <p className="no-data">No students available</p>;
  }

  return (
    <div className="attendance-table-wrapper">
      <table className="attendance-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Program</th>
            <th>Year</th>
            <th>Section</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record) => (
            <tr key={record.id}>
              <td>{record.student_id}</td>
              <td>{record.full_name}</td>
              <td>{record.program}</td>
              <td>{record.year_level}</td>
              <td>{record.section}</td>
              <td>
                <span
                  className={`status-badge ${record.status.toLowerCase().replace(' ', '-')}`}
                >
                  {record.status}
                </span>
              </td>
              <td>
                <select
                  className="status-select"
                  value={record.status}
                  onChange={(e) =>
                    handleStatusChange(record.id, e.target.value)
                  }
                  disabled={updatingId === record.id}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
