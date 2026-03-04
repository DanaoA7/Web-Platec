// 'use client';

// import React, { useState, useEffect } from 'react';
// import api from '../services/api';
// import Layout from '../components/Layout';
// import '../styles/dashboard.css';
// import '../styles/attendance.css';

// const AttendancePage = () => {
//   const [attendance, setAttendance] = useState([]);
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split('T')[0]
//   );  
//   const [programId, setProgramId] = useState('');
//   const [yearLevelId, setYearLevelId] = useState('');
//   const [sectionId, setSectionId] = useState('');
//   const [programs, setPrograms] = useState([]);
//   const [yearLevels, setYearLevels] = useState([]);
//   const [sections, setSections] = useState([]);
  
//   // Search state
//   const [searchQuery, setSearchQuery] = useState('');

//   // Fetch data when filters change
//   useEffect(() => {
//     fetchData();
//   }, [selectedDate, programId, yearLevelId, sectionId]);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       setError('');

//       if (programs.length === 0) {
//         const [programsRes, yearLevelsRes, sectionsRes] = await Promise.all([
//           api.get('/references/programs'),
//           api.get('/references/year-levels'),
//           api.get('/references/sections'),
//         ]);

//         setPrograms(programsRes.data);
//         setYearLevels(yearLevelsRes.data);
//         setSections(sectionsRes.data);
//       }

//       const [attendanceRes, statsRes] = await Promise.all([
//         api.get('/attendance', {
//           params: {
//             date: selectedDate,
//             programId: programId || undefined,
//             yearLevelId: yearLevelId || undefined,
//             sectionId: sectionId || undefined,
//           },
//         }),
//         api.get('/attendance/stats', {
//           params: {
//             date: selectedDate,
//             programId: programId || undefined,
//             yearLevelId: yearLevelId || undefined,
//             sectionId: sectionId || undefined,
//           },
//         }),
//       ]);

//       // Map backend fields to frontend expected fields
//       const mappedAttendance = (attendanceRes.data || []).map((student) => ({
//         studentId: student.student_id,
//         name: student.full_name,
//         program: student.program,
//         year: student.year_level,
//         section: student.section,
//         status: student.status,
//         id: student.id,
//       }));
//       setAttendance(mappedAttendance);
//       setStats(statsRes.data || {});
//     } catch (err) {
//       setError('Failed to load attendance data');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleMarkAttendance = async (studentId, status) => {
//     try {
//       await api.post('/attendance', {
//         studentId,
//         date: selectedDate,
//         status,
//       });
//       fetchData();
//     } catch (err) {
//       setError('Failed to mark attendance');
//     }
//   };

//   // Filter attendance based on search query (case-insensitive)
//   const filteredAttendance = attendance.filter((student) => {
//     const query = searchQuery.toLowerCase();
//     return (
//       student.name.toLowerCase().includes(query) ||
//       student.studentId.toLowerCase().includes(query) ||
//       student.section.toLowerCase().includes(query)
//     );
//   });

//   return (
//     <Layout>
//       {/* Header with Title and Date Picker */}
//       <div className="attendance-header">
//         <h1>Mark Attendance</h1>
//         <div className="header-date-picker">
//           <label htmlFor="date">Date</label>
//           <input
//             id="date"
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             className="date-input-header"
//           />
//         </div>
//       </div>

//       {error && <div className="alert error">{error}</div>}

//       {/* Statistics Bar */}
//       {stats && (
//         <div className="attendance-stats-bar">
//           <div className="stat-item present">
//             <div className="stat-label">Present</div>
//             <div className="stat-value">{stats.present || 0}</div>
//           </div>
//           <div className="stat-item absent">
//             <div className="stat-label">Absent</div>
//             <div className="stat-value">{stats.absent || 0}</div>
//           </div>
//           <div className="stat-item late">
//             <div className="stat-label">Late</div>
//             <div className="stat-value">{stats.late || 0}</div>
//           </div>
//           <div className="stat-item marked">
//             <div className="stat-label">Marked</div>
//             <div className="stat-value">
//               {(stats.present || 0 )+'/' + (stats.absent ||  0)+'/' + (stats.late || 0)}{stats.total_students ? `/${stats.total_students}` : ''}
//             </div>
//           </div>
//           <div className="stat-item progress">
//             <div className="stat-label">Progress</div>
//             <div className="stat-value">{stats.attendance_percentage || 0}%</div>
//           </div>
//         </div>
//       )}

//       {/* Filters Section */}
//      {/* Filters Section */}
// <div className="attendance-filters">
//   <div className="filter-group">
//     <label htmlFor="program-select">Program</label>
//     <select
//       id="program-select"
//       value={programId}
//       onChange={(e) => setProgramId(e.target.value)}
//       className="filter-select"
//     >
//       <option value="">All Programs</option>
//       {programs.map((p) => (
//         <option key={p.id} value={p.id}>
//           {p.name}
//         </option>
//       ))}
//     </select>
//   </div>

//   <div className="filter-group">
//     <label htmlFor="yearlevel-select">Year Level</label>
//     <select
//       id="yearlevel-select"
//       value={yearLevelId}
//       onChange={(e) => setYearLevelId(e.target.value)}
//       className="filter-select"
//     >
//       <option value="">All Year Levels</option>
//       {yearLevels.map((y) => (
//         <option key={y.id} value={y.id}>
//           {y.level}
//         </option>
//       ))}
//     </select>
//   </div>

//   <div className="filter-group">
//     <label htmlFor="section-select">Section</label>
//     <select
//       id="section-select"
//       value={sectionId}
//       onChange={(e) => setSectionId(e.target.value)}
//       className="filter-select"
//     >
//       <option value="">All Sections</option>
//       {sections.map((s) => (
//         <option key={s.id} value={s.id}>
//           {s.name}
//         </option>
//       ))}
//     </select>
//   </div>
// </div>

//       {/* Search Bar */}
//       <div
//         style={{
//           backgroundColor: '#f7f7f7',
//           borderRadius: '8px',
//           padding: '10px 16px',
//           marginBottom: '24px',
//           color: '#999',
//           fontSize: '14px',
//           display: 'flex',
//           alignItems: 'center',
//           gap: '8px',
//         }}
//       >
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           height="16"
//           viewBox="0 0 24 24"
//           width="16"
//           fill="#999"
//         >
//           <path d="M15.5 14h-.79l-.28-.27a6.471 6.471 0 001.48-5.34C15.07 5.6 12.52 3 9.5 3S4 5.6 4 8.5 6.55 14 9.5 14a6.471 6.471 0 005.34-1.48l.27.28v.79l5 4.99L20.49 19l-4.99-5zM9.5 12c-1.93 0-3.5-1.57-3.5-3.5S7.57 5 9.5 5 13 6.57 13 8.5 11.43 12 9.5 12z" />
//         </svg>
//         <input
//           type="text"
//           placeholder="Search students by name, ID, or section..."
//           style={{
//             border: 'none',
//             outline: 'none',
//             backgroundColor: 'transparent',
//             width: '100%',
//             fontSize: '14px',
//             color: '#333',
//           }}
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//         />
//       </div>

//       {/* Attendance Table */}
//       {loading ? (
//         <p className="loading">Loading attendance data...</p>
//       ) : (
//         <table
//           style={{
//             width: '100%',
//             borderCollapse: 'collapse',
//             borderRadius: '8px',
//             overflow: 'hidden',
//             backgroundColor: '#fff',
//             boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
//           }}
//         >
//           <thead
//             style={{
//               backgroundColor: '#f9f9f9',
//               color: '#555',
//               fontWeight: '600',
//               fontSize: '14px',
//             }}
//           >
//             <tr>
//               <th style={{ textAlign: 'left', padding: '12px 16px' }}>Student ID</th>
//               <th style={{ textAlign: 'left', padding: '12px 16px' }}>Name</th>
//               <th style={{ textAlign: 'left', padding: '12px 16px' }}>Program</th>
//               <th style={{ textAlign: 'left', padding: '12px 16px' }}>Year</th>
//               <th style={{ textAlign: 'left', padding: '12px 16px' }}>Section</th>
//               <th style={{ textAlign: 'left', padding: '12px 16px' }}>Status</th>
//               <th style={{ textAlign: 'left', padding: '12px 16px' }}>Actions</th>
//             </tr>
//           </thead>
//           <tbody
//             style={{
//               color: '#333',
//               fontSize: '14px',
//               textAlign: 'left',
//             }}
//           >
//             {filteredAttendance.length === 0 ? (
//               <tr>
//                 <td colSpan={7} style={{ padding: '40px 16px', textAlign: 'center', color: '#999' }}>
//                   No students available.
//                 </td>
//               </tr>
//             ) : (
//               filteredAttendance.map((student) => (
//                 <tr key={student.studentId} style={{ borderBottom: '1px solid #eee' }}>
//                   <td style={{ padding: '12px 16px' }}>{student.studentId}</td>
//                   <td style={{ padding: '12px 16px' }}>{student.name}</td>
//                   <td style={{ padding: '12px 16px' }}>{student.program}</td>
//                   <td style={{ padding: '12px 16px' }}>{student.year}</td>
//                   <td style={{ padding: '12px 16px' }}>{student.section}</td>
//                   <td style={{ padding: '12px 16px' }}>{student.status || '-'}</td>
//                   <td style={{ padding: '12px 16px' }}>
//                     {/* Add action buttons here if needed */}
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       )}
//     </Layout>
//   );
// };

// export default AttendancePage;


'use client';

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import '../styles/dashboard.css';
import '../styles/attendance.css';
import { FaCheck, FaTimes, FaClock } from 'react-icons/fa';

const AttendancePage = () => {
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [programId, setProgramId] = useState('');
  const [yearLevelId, setYearLevelId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [programs, setPrograms] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);
  const [sections, setSections] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch programs, year levels, sections only once
  useEffect(() => {
    const fetchReferences = async () => {
      try {
        const [programsRes, yearLevelsRes, sectionsRes] = await Promise.all([
          api.get('/references/programs'),
          api.get('/references/year-levels'),
          api.get('/references/sections'),
        ]);
        setPrograms(programsRes.data);
        setYearLevels(yearLevelsRes.data);
        setSections(sectionsRes.data);
      } catch (err) {
        console.error('Failed to fetch references:', err);
      }
    };
    fetchReferences();
  }, []);

  // Fetch attendance whenever filters or date change
  useEffect(() => {
    fetchAttendance();
  }, [selectedDate, programId, yearLevelId, sectionId]);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError('');

      const [attendanceRes, statsRes] = await Promise.all([
        api.get('/attendance', { params: { date: selectedDate, programId, yearLevelId, sectionId } }),
        api.get('/attendance/stats', { params: { date: selectedDate, programId, yearLevelId, sectionId } }),
      ]);

      const mappedAttendance = (attendanceRes.data || []).map((s) => ({
        studentId: s.student_id,
        name: s.full_name,
        program: s.program,
        year: s.year_level,
        section: s.section,
        status: s.status,
        id: s.id,
      }));

      setAttendance(mappedAttendance);
      setStats(statsRes.data || {});
    } catch (err) {
      setError('Failed to load attendance data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (studentId, status) => {
    try {
      await api.post('/attendance', { studentId, date: selectedDate, status });
      fetchAttendance();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to mark attendance.');
      console.error(err);
    }
  };

  const filteredAttendance = attendance.filter((s) => {
    const query = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.studentId.toLowerCase().includes(query) ||
      s.section.toLowerCase().includes(query)
    );
  });

  return (
    <Layout>
      {/* Header */}
      <div className="attendance-header">
        <h1>Mark Attendance</h1>
        <div className="header-date-picker">
          <label htmlFor="date">Date</label>
          <input
            id="date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input-header"
          />
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}

      {/* Stats */}
      {stats && (
        <div className="attendance-stats-bar">
          {['present', 'absent', 'late'].map((type) => (
            <div key={type} className={`stat-item ${type}`}>
              <div className="stat-label">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
              <div className="stat-value">{stats[type] || 0}</div>
            </div>
          ))}
          <div className="stat-item progress">
            <div className="stat-label">Progress</div>
            <div className="stat-value">{stats.attendance_percentage || 0}%</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="attendance-filters">
        <div className="filter-group">
          <label>Program</label>
          <select value={programId} onChange={(e) => setProgramId(e.target.value)}>
            <option value="">All Programs</option>
            {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Year Level</label>
          <select value={yearLevelId} onChange={(e) => setYearLevelId(e.target.value)}>
            <option value="">All Years</option>
            {yearLevels.map((y) => <option key={y.id} value={y.id}>{y.level}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label>Section</label>
          <select value={sectionId} onChange={(e) => setSectionId(e.target.value)}>
            <option value="">All Sections</option>
            {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {/* Search */}
      <div className="attendance-search-bar">
        <input
          type="text"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? <p className="loading">Loading...</p> : (
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
            {filteredAttendance.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>No students available.</td></tr>
            ) : filteredAttendance.map((s) => (
              <tr key={s.studentId}>
                <td>{s.studentId}</td>
                <td>{s.name}</td>
                <td>{s.program}</td>
                <td>{s.year}</td>
                <td>{s.section}</td>
                <td>{s.status || '-'}</td>
              <td style={{ display: 'flex', gap: '8px' }}>
  <button
    onClick={() => handleMarkAttendance(s.id, 'Present')}
    style={{
      backgroundColor: '#4CAF50', // green
      border: 'none',
      color: 'white',
      padding: '8px',
      borderRadius: '4px',
      cursor: 'pointer',
    }}
  >
    <FaCheck />
  </button>

  <button
    onClick={() => handleMarkAttendance(s.id, 'Absent')}
    style={{
      backgroundColor: '#F44336', // red
      border: 'none',
      color: 'white',
      padding: '8px',
      borderRadius: '4px',
      cursor: 'pointer',
    }}
  >
    <FaTimes />
  </button>

  <button
    onClick={() => handleMarkAttendance(s.id, 'Late')}
    style={{
      backgroundColor: '#FF9800', // orange
      border: 'none',
      color: 'white',
      padding: '8px',
      borderRadius: '4px',
      cursor: 'pointer',
    }}
  >
    <FaClock />
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
};

export default AttendancePage;