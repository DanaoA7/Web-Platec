'use client';

import React from 'react';

const StudentTable = ({ students, onDelete }) => {
  if (students.length === 0) {
    return <p className="no-data">No students added yet</p>;
  }

  return (
    <div className="table-container">
      <table className="students-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Program</th>
            <th>Year</th>
            <th>Section</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.student_id}</td>
              <td>{student.full_name}</td>
              <td>{student.email}</td>
              <td>{student.program}</td>
              <td>{student.year_level}</td>
              <td>{student.section}</td>
              <td>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(student.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;
