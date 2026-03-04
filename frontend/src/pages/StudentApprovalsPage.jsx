// 'use client';

// import React, { useState, useEffect } from 'react';
// import Layout from '../components/Layout';
// import '../styles/dashboard.css';

// export default function StudentApprovalsPage() {
//   const [pendingStudents, setPendingStudents] = useState([]);
//   const [approvedStudents, setApprovedStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [activeTab, setActiveTab] = useState('pending');
//   const [rejectionReason, setRejectionReason] = useState('');
//   const [rejectingId, setRejectingId] = useState(null);

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');

//       // Fetch pending students
//       const pendingRes = await fetch('http://localhost:5000/api/admin/students/pending', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Fetch approved students
//       const approvedRes = await fetch('http://localhost:5000/api/admin/students', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!pendingRes.ok || !approvedRes.ok) throw new Error('Failed to fetch students');

//       setPendingStudents(await pendingRes.json());
//       setApprovedStudents(await approvedRes.json());
//       setError('');
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprove = async (studentId) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`http://localhost:5000/api/admin/students/${studentId}/approve`, {
//         method: 'POST',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!response.ok) throw new Error('Failed to approve student');

//       // Remove from pending and refetch
//       fetchStudents();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleReject = async (studentId) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`http://localhost:5000/api/admin/students/${studentId}/reject`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ reason: rejectionReason }),
//       });

//       if (!response.ok) throw new Error('Failed to reject student');

//       setRejectingId(null);
//       setRejectionReason('');
//       fetchStudents();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <Layout>
//       <div className="dashboard-content">
//         <div className="page-header">
//           <h1>Student Account Approvals</h1>
//           <span className="badge-count">{pendingStudents.length} Pending</span>
//         </div>

//         {error && <div className="error-message">{error}</div>}

//         <div className="tabs">
//           <button className={`tab ${activeTab === 'pending' ? 'active' : ''}`} onClick={() => setActiveTab('pending')}>
//             Pending Approvals ({pendingStudents.length})
//           </button>
//           <button className={`tab ${activeTab === 'approved' ? 'active' : ''}`} onClick={() => setActiveTab('approved')}>
//             Approved Students ({approvedStudents.length})
//           </button>
//         </div>

//         {loading ? (
//           <div className="loading">Loading students...</div>
//         ) : activeTab === 'pending' ? (
//           pendingStudents.length === 0 ? (
//             <div className="empty-state">
//               <p>No pending student approvals</p>
//             </div>
//           ) : (
//             <div className="approvals-container">
//               {pendingStudents.map((student) => (
//                 <div key={student.id} className="approval-card">
//                   <div className="card-header">
//                     <h3>{student.full_name}</h3>
//                     <span className="badge pending">Pending</span>
//                   </div>

//                   <div className="card-content">
//                     <p>
//                       <strong>Student ID:</strong> {student.student_id}
//                     </p>
//                     <p>
//                       <strong>Email:</strong> {student.email}
//                     </p>
//                     <p>
//                       <strong>Phone:</strong> {student.phone || 'N/A'}
//                     </p>
//                     <p>
//                       <strong>Program:</strong> {student.program}
//                     </p>
//                     <p>
//                       <strong>Year Level:</strong> {student.year_level}
//                     </p>
//                     <p>
//                       <strong>Section:</strong> {student.section}
//                     </p>
//                     <p className="registered-date">
//                       Registered: {new Date(student.created_at).toLocaleDateString()}
//                     </p>
//                   </div>

//                   <div className="card-actions">
//                     <button className="btn-approve" onClick={() => handleApprove(student.id)}>
//                       Approve
//                     </button>

//                     {rejectingId === student.id ? (
//                       <div className="rejection-form">
//                         <textarea
//                           placeholder="Reason for rejection..."
//                           value={rejectionReason}
//                           onChange={(e) => setRejectionReason(e.target.value)}
//                         />
//                         <div className="form-buttons">
//                           <button
//                             className="btn-confirm"
//                             onClick={() => handleReject(student.id)}
//                             disabled={!rejectionReason.trim()}
//                           >
//                             Confirm Rejection
//                           </button>
//                           <button className="btn-cancel" onClick={() => setRejectingId(null)}>
//                             Cancel
//                           </button>
//                         </div>
//                       </div>
//                     ) : (
//                       <button className="btn-reject" onClick={() => setRejectingId(student.id)}>
//                         Reject
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )
//         ) : (
//           approvedStudents.length === 0 ? (
//             <div className="empty-state">
//               <p>No approved students yet</p>
//             </div>
//           ) : (
//             <div className="table-container">
//               <table className="data-table">
//                 <thead>
//                   <tr>
//                     <th>Student ID</th>
//                     <th>Full Name</th>
//                     <th>Email</th>
//                     <th>Program</th>
//                     <th>Year Level</th>
//                     <th>Section</th>
//                     <th>Approved Date</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {approvedStudents.map((student) => (
//                     <tr key={student.id}>
//                       <td>{student.student_id}</td>
//                       <td>{student.full_name}</td>
//                       <td>{student.email}</td>
//                       <td>{student.program}</td>
//                       <td>{student.year_level}</td>
//                       <td>{student.section}</td>
//                       <td>{new Date(student.created_at).toLocaleDateString()}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )
//         )}
//       </div>
//     </Layout>
//   );
// }


import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import '../styles/dashboard.css';
import '../styles/approvals.css';

export default function StudentApprovalsPage() {
  const [pendingStudents, setPendingStudents] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingId, setRejectingId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Fetch pending students
      const pendingRes = await fetch('http://localhost:5000/api/admin/students/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Fetch approved students
      const approvedRes = await fetch('http://localhost:5000/api/admin/students', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!pendingRes.ok || !approvedRes.ok) throw new Error('Failed to fetch students');

      setPendingStudents(await pendingRes.json());
      setApprovedStudents(await approvedRes.json());
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/students/${studentId}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to approve student');

      // Remove from pending and refetch
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReject = async (studentId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/students/${studentId}/reject`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      if (!response.ok) throw new Error('Failed to reject student');

      setRejectingId(null);
      setRejectionReason('');
      fetchStudents();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Layout>
      <div className="approvals-page">
        {/* Header */}
        <div className="approvals-header">
          <div className="header-content">
            <h1>Student Account Approvals</h1>
            <p className="header-subtitle">Review and manage student registration requests</p>
          </div>
          <div className="header-stats">
            <div className="stat">
              <span className="stat-number">{pendingStudents.length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat">
              <span className="stat-number">{approvedStudents.length}</span>
              <span className="stat-label">Approved</span>
            </div>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {/* Tabs */}
        <div className="approvals-tabs">
          <button 
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`} 
            onClick={() => setActiveTab('pending')}
          >
            <span className="tab-icon">📋</span>
            Pending Approvals
            <span className="tab-badge">{pendingStudents.length}</span>
          </button>
          <button 
            className={`tab-button ${activeTab === 'approved' ? 'active' : ''}`} 
            onClick={() => setActiveTab('approved')}
          >
            <span className="tab-icon">✓</span>
            Approved Students
            <span className="tab-badge">{approvedStudents.length}</span>
          </button>
        </div>

        {/* Content */}
        <div className="approvals-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading students...</p>
            </div>
          ) : activeTab === 'pending' ? (
            pendingStudents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No pending approvals</h3>
                <p>All student registrations have been reviewed</p>
              </div>
            ) : (
              <div className="cards-grid">
                {pendingStudents.map((student) => (
                  <div key={student.id} className="student-card">
                    <div className="card-header">
                      <div className="header-top">
                        <h3>{student.full_name}</h3>
                        <span className="badge-pending">⏳ Pending</span>
                      </div>
                      <p className="student-id">{student.student_id}</p>
                    </div>

                    <div className="card-info">
                      <div className="info-row">
                        <span className="info-label">Email</span>
                        <span className="info-value">{student.email}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Phone</span>
                        <span className="info-value">{student.phone || '—'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Program</span>
                        <span className="info-value">{student.program}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Year Level</span>
                        <span className="info-value">{student.year_level}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Section</span>
                        <span className="info-value">{student.section}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Registered</span>
                        <span className="info-value">{new Date(student.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="card-actions">
                      {rejectingId === student.id ? (
                        <div className="rejection-form">
                          <textarea
                            placeholder="Enter reason for rejection..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="rejection-textarea"
                          />
                          <div className="form-buttons">
                            <button
                              className="btn btn-confirm"
                              onClick={() => handleReject(student.id)}
                              disabled={!rejectionReason.trim()}
                            >
                              Confirm Rejection
                            </button>
                            <button 
                              className="btn btn-secondary"
                              onClick={() => setRejectingId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button 
                            className="btn btn-approve" 
                            onClick={() => handleApprove(student.id)}
                          >
                            ✓ Approve
                          </button>
                          <button 
                            className="btn btn-reject" 
                            onClick={() => setRejectingId(student.id)}
                          >
                            ✕ Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            approvedStudents.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✓</div>
                <h3>No approved students</h3>
                <p>Approved student records will appear here</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="approvals-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Program</th>
                      <th>Year Level</th>
                      <th>Section</th>
                      <th>Approved Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvedStudents.map((student) => (
                      <tr key={student.id}>
                        <td data-label="Student ID">{student.student_id}</td>
                        <td data-label="Full Name">{student.full_name}</td>
                        <td data-label="Email">{student.email}</td>
                        <td data-label="Program">{student.program}</td>
                        <td data-label="Year Level">{student.year_level}</td>
                        <td data-label="Section">{student.section}</td>
                        <td data-label="Approved Date">{new Date(student.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </Layout>
  );
}

