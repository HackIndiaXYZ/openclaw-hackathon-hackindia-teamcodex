import { useContext, useEffect, useMemo, useState } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { AppContext, AppProvider } from './context/AppContext';
import { getAppTheme } from './theme';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Attendance from './pages/Attendance';
import Marks from './pages/Marks';
import Reports from './pages/Reports';
import AdminDashboard from './pages/AdminDashboard';

function renderPage(activePage, appState) {
  if (activePage === 'students') {
    return (
      <Students
        students={appState.students}
        departments={appState.departments}
        programs={appState.programs}
        batches={appState.batches}
        onAddStudent={appState.addStudent}
      />
    );
  }

  if (activePage === 'attendance') {
    return (
      <Attendance
        students={appState.students}
        attendance={appState.attendance}
        facultyAssignments={appState.facultyAssignments}
        recognitionResult={appState.recognitionResult}
        attendanceLoading={appState.attendanceLoading}
        onAddAttendanceRecord={appState.addAttendanceRecord}
        onRunAttendanceRecognition={appState.runAttendanceRecognition}
        onSaveRecognizedAttendance={appState.saveRecognizedAttendance}
      />
    );
  }

  if (activePage === 'marks') {
    return <Marks students={appState.students} marks={appState.marks} onAddMarksRecord={appState.addMarksRecord} />;
  }

  if (activePage === 'reports') {
    return <Reports students={appState.students} reports={appState.reports} onGenerateReport={appState.generateReport} />;
  }

  if (activePage === 'admin') {
    return <AdminDashboard currentUser={appState.currentUser} />;
  }

  return <Dashboard dashboardStats={appState.dashboardStats} alerts={appState.alerts} students={appState.students} />;
}

function AppShell({ themeMode, onToggleTheme }) {
  const appState = useContext(AppContext);
  const isAdminOnlyUser = appState.currentUser?.role === 'admin';

  useEffect(() => {
    if (isAdminOnlyUser && appState.activePage !== 'admin') {
      appState.setActivePage('admin');
    }
  }, [isAdminOnlyUser, appState.activePage, appState.setActivePage]);

  if (!appState.isLoggedIn) {
    return <Login onLogin={appState.login} onRegister={appState.register} authLoading={appState.authLoading} errorMessage={appState.errorMessage} themeMode={themeMode} onToggleTheme={onToggleTheme} />;
  }

  const effectivePage = isAdminOnlyUser ? 'admin' : appState.activePage;

  const pageTitles = {
    dashboard: { title: 'Dashboard', subtitle: 'A quick look at attendance, alerts and report activity.' },
    students: { title: 'Students', subtitle: 'Manage student records with proper department, program and batch mapping.' },
    attendance: { title: 'Attendance', subtitle: 'Choose a teaching assignment, then capture attendance batch-wise using manual flow or image recognition.' },
    marks: { title: 'Marks', subtitle: 'Save academic performance data for later analysis and reports.' },
    reports: { title: 'Reports', subtitle: 'Generate clean bilingual student comments in one click.' },
    admin: { title: 'Admin Dashboard', subtitle: 'Manage users, students, departments, programs, batches, subjects and faculty assignments from one place.' }
  };

  const currentPage = pageTitles[effectivePage] || pageTitles.dashboard;

  return (
    <div className="app-shell">
      <Sidebar activePage={effectivePage} setActivePage={appState.setActivePage} onLogout={appState.logout} currentUser={appState.currentUser} />
      <main className="app-main">
        <Header title={currentPage.title} subtitle={currentPage.subtitle} user={appState.currentUser} themeMode={themeMode} onToggleTheme={onToggleTheme} />
        {appState.errorMessage ? <p className="page-error">{appState.errorMessage}</p> : null}
        {appState.isLoading ? <div className="page-loader">Loading latest data...</div> : renderPage(effectivePage, appState)}
      </main>
    </div>
  );
}

export default function App() {
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('edutrack_theme') || 'light');

  useEffect(() => {
    localStorage.setItem('edutrack_theme', themeMode);
    document.documentElement.setAttribute('data-theme', themeMode);
  }, [themeMode]);

  const muiTheme = useMemo(() => getAppTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AppProvider>
        <AppShell themeMode={themeMode} onToggleTheme={() => setThemeMode((previousMode) => previousMode === 'light' ? 'dark' : 'light')} />
      </AppProvider>
    </ThemeProvider>
  );
}
