// 'use client';

// import React, { useState, useEffect } from 'react';
// import api from '../services/api';
// import Layout from '../components/Layout';
// // import '../styles/reports.css';
// import '../styles/reports.css';
// const ReportsPage = () => {
//   const [reportType, setReportType] = useState('daily');
//   const [startDate, setStartDate] = useState(() => {
//     const date = new Date();
//     date.setDate(date.getDate() - 7);
//     return date.toISOString().split('T')[0];
//   });
//   const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
//   const [programId, setProgramId] = useState('');
//   const [yearLevelId, setYearLevelId] = useState('');
//   const [sectionId, setSectionId] = useState('');
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [programs, setPrograms] = useState([]);
//   const [yearLevels, setYearLevels] = useState([]);
//   const [sections, setSections] = useState([]);

//   useEffect(() => {
//     fetchReferenceData();
//   }, []);

//   const fetchReferenceData = async () => {
//     try {
//       const [programsRes, yearLevelsRes, sectionsRes] = await Promise.all([
//         api.get('/references/programs'),
//         api.get('/references/year-levels'),
//         api.get('/references/sections'),
//       ]);

//       setPrograms(programsRes.data);
//       setYearLevels(yearLevelsRes.data);
//       setSections(sectionsRes.data);
//     } catch (err) {
//       console.error('Failed to load reference data:', err);
//     }
//   };

  const fetchReports = async (printAfter = false) => {
    try {
      setLoading(true);
      setError('');

      const params = {
        startDate,
        endDate,
        programId: programId || undefined,
        yearLevelId: yearLevelId || undefined,
        sectionId: sectionId || undefined,
      };

      const endpoint = reportType === 'daily' ? '/attendance/reports/daily' : '/attendance/reports/weekly';
      const response = await api.get(endpoint, { params });

      setReports(response.data || []);
      if (printAfter) {
        setTimeout(() => {
          window.print();
        }, 300);
      }
    } catch (err) {
      setError('Failed to load reports');
      setReports([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = (print = false) => {
    if (!startDate || !endDate) {
      setError('Please select start and end dates');
      return;
    }
    fetchReports(print);
  };

//   const calculateTotalStats = () => {
//     if (reports.length === 0) return { present: 0, absent: 0, late: 0, average: 0 };

//     let totalPresent = 0;
//     let totalAbsent = 0;
//     let totalLate = 0;
//     let totalPercentages = 0;

//     reports.forEach((report) => {
//       totalPresent += report.present_count || 0;
//       totalAbsent += report.absent_count || 0;
//       totalLate += report.late_count || 0;
//       totalPercentages += report.attendance_percentage || 0;
//     });

//     const average = reports.length > 0 ? totalPercentages / reports.length : 0;

//     return {
//       present: totalPresent,
//       absent: totalAbsent,
//       late: totalLate,
//       average: average.toFixed(2),
//     };
//   };

//   const totals = calculateTotalStats();

//   return (
//     <Layout>
//       <div className="dashboard-header">
//         <h1>Attendance Reports</h1>
//       </div>

//       {error && <div className="alert error">{error}</div>}

//       <div className="reports-container">
//         <div className="reports-controls">
//           <div className="control-group">
//             <label htmlFor="report-type">Report Type</label>
//             <select
//               id="report-type"
//               value={reportType}
//               onChange={(e) => setReportType(e.target.value)}
//               className="filter-select"
//             >
//               <option value="daily">Daily Report</option>
//               <option value="weekly">Weekly Report</option>
//             </select>
//           </div>

//           <div className="control-group">
//             <label htmlFor="start-date">Start Date</label>
//             <input
//               id="start-date"
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//             />
//           </div>

//           <div className="control-group">
//             <label htmlFor="end-date">End Date</label>
//             <input
//               id="end-date"
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//             />
//           </div>

//           <div className="control-group">
//             <label htmlFor="program-filter">Program</label>
//             <select
//               id="program-filter"
//               value={programId}
//               onChange={(e) => setProgramId(e.target.value)}
//               className="filter-select"
//             >
//               <option value="">All Programs</option>
//               {programs.map((p) => (
//                 <option key={p.id} value={p.id}>
//                   {p.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="control-group">
//             <label htmlFor="year-level-filter">Year Level</label>
//             <select
//               id="year-level-filter"
//               value={yearLevelId}
//               onChange={(e) => setYearLevelId(e.target.value)}
//               className="filter-select"
//             >
//               <option value="">All Year Levels</option>
//               {yearLevels.map((y) => (
//                 <option key={y.id} value={y.id}>
//                   {y.level}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="control-group">
//             <label htmlFor="section-filter">Section</label>
//             <select
//               id="section-filter"
//               value={sectionId}
//               onChange={(e) => setSectionId(e.target.value)}
//               className="filter-select"
//             >
//               <option value="">All Sections</option>
//               {sections.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <button
//             className="btn-generate"
//             onClick={handleGenerateReport}
//             disabled={loading}
//           >
//             {loading ? 'Generating...' : 'Generate Report'}
//           </button>
//         </div>

//         {reports.length > 0 && (
//           <>
//             <div className="report-summary">
//               <div className="summary-card present">
//                 <div className="summary-value">{totals.present}</div>
//                 <div className="summary-label">Total Present</div>
//               </div>
//               <div className="summary-card absent">
//                 <div className="summary-value">{totals.absent}</div>
//                 <div className="summary-label">Total Absent</div>
//               </div>
//               <div className="summary-card late">
//                 <div className="summary-value">{totals.late}</div>
//                 <div className="summary-label">Total Late</div>
//               </div>
//               <div className="summary-card percentage">
//                 <div className="summary-value">{totals.average}%</div>
//                 <div className="summary-label">Avg Attendance</div>
//               </div>
//             </div>

//             <div className="report-table-container">
//               <table className="report-table">
//                 <thead>
//                   <tr>
//                     <th>{reportType === 'daily' ? 'Date' : 'Week'}</th>
//                     <th>Total Records</th>
//                     <th>Present</th>
//                     <th>Absent</th>
//                     <th>Late</th>
//                     <th>Attendance %</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {reports.map((report, index) => (
//                     <tr key={index}>
//                       <td>
//                         {reportType === 'daily'
//                           ? new Date(report.attendance_date).toLocaleDateString('en-US', {
//                               weekday: 'short',
//                               year: 'numeric',
//                               month: 'short',
//                               day: 'numeric',
//                             })
//                           : `${new Date(report.week_start).toLocaleDateString('en-US', {
//                               month: 'short',
//                               day: 'numeric',
//                             })} - ${new Date(report.week_end).toLocaleDateString('en-US', {
//                               month: 'short',
//                               day: 'numeric',
//                               year: 'numeric',
//                             })}`}
//                       </td>
//                       <td>{report.total_records || report.total_students}</td>
//                       <td className="status-present">{report.present_count}</td>
//                       <td className="status-absent">{report.absent_count}</td>
//                       <td className="status-late">{report.late_count}</td>
//                       <td className="percentage">{report.attendance_percentage}%</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </>
//         )}

//         {!loading && reports.length === 0 && (
//           <div className="no-data">
//             <p>No attendance data available for the selected period.</p>
//             <p className="hint">Click "Generate Report" to view attendance reports.</p>
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default ReportsPage;

'use client';

import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import Layout from '../components/Layout';
import '../styles/reports.css';

const ReportsPage = () => {
  const [reportType, setReportType] = useState('daily');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [programId, setProgramId] = useState('');
  const [yearLevelId, setYearLevelId] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [programs, setPrograms] = useState([]);
  const [yearLevels, setYearLevels] = useState([]);
  const [sections, setSections] = useState([]);
  const reportRef = useRef(null);

  useEffect(() => {
    fetchReferenceData();
  }, []);

  useEffect(() => {
  const today = new Date().toISOString().split('T')[0];

  if (reportType === 'daily') {
    // Today only
    setStartDate(today);
    setEndDate(today);
  } else {
    // Whole current week
    const { start, end } = getCurrentWeekRange();
    setStartDate(start);
    setEndDate(end);
  }
}, [reportType]);
  const fetchReferenceData = async () => {
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
      console.error('Failed to load reference data:', err);
    }
  };

  const fetchReports = async (printAfter = false) => {
    try {
      setLoading(true);
      setError('');

      const params = {
        startDate,
        endDate,
        programId: programId || undefined,
        yearLevelId: yearLevelId || undefined,
        sectionId: sectionId || undefined,
      };

      const endpoint = reportType === 'daily' ? '/attendance/reports/daily' : '/attendance/reports/weekly';
      const response = await api.get(endpoint, { params });

      setReports(response.data || []);
      // Print after setting reports (wait for DOM update)
      if (printAfter) {
        setTimeout(() => {
          window.print();
        }, 300);
      }
    } catch (err) {
      setError('Failed to load reports');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = (print = false) => {
    if (!startDate || !endDate) {
      setError('Please select start and end dates');
      return;
    }
    fetchReports(print);
  };

  // const calculateTotalStats = () => {
  //   if (reports.length === 0) return { present: 0, absent: 0, late: 0, average: 0 };

  //   let totalPresent = 0;
  //   let totalAbsent = 0;
  //   let totalLate = 0;
  //   let totalPercentages = 0;

  //   reports.forEach((report) => {
  //     totalPresent += report.present_count || 0;
  //     totalAbsent += report.absent_count || 0;
  //     totalLate += report.late_count || 0;
  //     totalPercentages += report.attendance_percentage || 0;
  //   });

  //   const average = reports.length > 0 ? totalPercentages / reports.length : 0;

  //   return {
  //     present: totalPresent,
  //     absent: totalAbsent,
  //     late: totalLate,
  //     average: average.toFixed(2),
  //   };
  // };

const calculateTotalStats = () => {
  if (reports.length === 0) {
    return { present: 0, absent: 0, late: 0, average: 0 };
  }

  let totalPresent = 0;
  let totalAbsent = 0;
  let totalLate = 0;
  let totalPercentages = 0;

  reports.forEach((report) => {
    totalPresent += Number(report.present_count) || 0;
    totalAbsent += Number(report.absent_count) || 0;
    totalLate += Number(report.late_count) || 0;
    totalPercentages += Number(report.attendance_percentage) || 0;
  });

  const average =
    reports.length > 0
      ? (totalPercentages / reports.length).toFixed(2)
      : 0;

  return {
    present: totalPresent,
    absent: totalAbsent,
    late: totalLate,
    average,
  };
};

  const totals = calculateTotalStats();

  const getCurrentWeekRange = () => {
  const today = new Date();
  const day = today.getDay(); // 0 = Sunday, 1 = Monday

  const diffToMonday = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);
  monday.setDate(today.getDate() + diffToMonday);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: monday.toISOString().split('T')[0],
    end: sunday.toISOString().split('T')[0],
  };
};

  return (
    <Layout>
      <div className="reports-container">
        {/* Report Type & Date Selection */}
        <div className="reports-header no-print">
          <div className="header-section">
            <label className="section-label">Report Type</label>
            <div className="report-type-buttons">
              <button
                className={`type-btn ${reportType === 'daily' ? 'active' : ''}`}
                onClick={() => setReportType('daily')}
              >
                Daily
              </button>
              <button
                className={`type-btn ${reportType === 'weekly' ? 'active' : ''}`}
                onClick={() => setReportType('weekly')}
              >
                Weekly
              </button>
            </div>
          </div>

          <div className="header-section">
            <label className="section-label">Select Date</label>
            <div className="date-input-group">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="date-input"
              />
              <span className="date-separator">to</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="date-input"
              />
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
       <div className="reports-stats">
  <div className="stat-card total">
    <div className="stat-top">
      <span className="stat-icon">👥</span>
      <span className="stat-title">Total Students</span>
    </div>
    <div className="stat-number">
      {reports.length > 0 ? reports[0].total_students || 0 : 0}
    </div>
  </div>

  <div className="stat-card present">
    <div className="stat-top">
      <span className="stat-icon">✔</span>
      <span className="stat-title">Present</span>
    </div>
    <div className="stat-number">{totals.present}</div>
  </div>

  <div className="stat-card absent">
    <div className="stat-top">
      <span className="stat-icon">✖</span>
      <span className="stat-title">Absent</span>
    </div>
    <div className="stat-number">{totals.absent}</div>
  </div>

  <div className="stat-card late">
    <div className="stat-top">
      <span className="stat-icon">⏱</span>
      <span className="stat-title">Late</span>
    </div>
    <div className="stat-number">{totals.late}</div>
  </div>
</div>

        {/* Filters Section */}
        <div className="reports-filters">
          <div className="filter-group">
            <label>Program</label>
            <select value={programId} onChange={(e) => setProgramId(e.target.value)}>
              <option value="">All Programs</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Year Level</label>
            <select value={yearLevelId} onChange={(e) => setYearLevelId(e.target.value)}>
              <option value="">All Year Levels</option>
              {yearLevels.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.level}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Section</label>
            <select value={sectionId} onChange={(e) => setSectionId(e.target.value)}>
              <option value="">All Sections</option>
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn-generate"
            onClick={() => handleGenerateReport(false)}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
          <button
            className="btn-generate btn-print"
            onClick={() => handleGenerateReport(true)}
            disabled={loading}y
            style={{ marginLeft: 8 }}
          >
            Print to PDF
          </button>
        </div>

        {error && <div className="alert error">{error}</div>}

        {reports.length > 0 && (
          <div ref={reportRef} className="print-section">

            {/* <div className="report-header">
              <h2>Attendance Report</h2>
              <p>{reportType === 'daily' ? 'Daily' : 'Weekly'} Report for {programName} - {yearLevelName} - {sectionName}</p>
            </div> */}

              <div className="auth-logo">
                <img src="/logow_bg.png" alt="Nurture Academy" /></div>


            {/* <div className="report-summary">
              <div className="summary-card present">
                <div className="summary-value">{totals.present}</div>
                <div className="summary-label">Total Present</div>
              </div>
              <div className="summary-card absent">
                <div className="summary-value">{totals.absent}</div>
                <div className="summary-label">Total Absent</div>
              </div>
              <div className="summary-card late">
                <div className="summary-value">{totals.late}</div>
                <div className="summary-label">Total Late</div>
              </div>
              <div className="summary-card percentage">
                <div className="summary-value">{totals.average}%</div>
                <div className="summary-label">Avg Attendance</div>
              </div>
            </div> */}

            <div className="report-table-container">
              <table className="report-table">
                <thead>
                  <tr>
                    <th>{reportType === 'daily' ? 'Date' : 'Week'}</th>
                    <th>Total Records</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Late</th>
                    <th>Attendance %</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report, index) => (
                    <tr key={index}>
                      <td>
                        {reportType === 'daily'
                          ? new Date(report.attendance_date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : `${new Date(report.week_start).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })} - ${new Date(report.week_end).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}`}
                      </td>
                      <td>{report.total_records || report.total_students}</td>
                      <td className="status-present">{report.present_count}</td>
                      <td className="status-absent">{report.absent_count}</td>
                      <td className="status-late">{report.late_count}</td>
                      <td className="percentage">{report.attendance_percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!loading && reports.length === 0 && (
          <div className="no-data no-print">
            <p>No attendance data available for the selected period.</p>
            <p className="hint">Click "Generate Report" to view attendance reports.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ReportsPage;
