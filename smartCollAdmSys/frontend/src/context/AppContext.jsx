import { createContext, useEffect, useMemo, useState } from 'react';
import { removeToken, saveToken } from '../api/apiClient';
import { getCurrentUser, loginUser, registerUser } from '../api/authApi';
import { fetchStudents, createStudent } from '../api/studentApi';
import { fetchAttendanceRecords, createAttendanceRecord, recognizeAttendanceImage } from '../api/attendanceApi';
import { fetchMarksRecords, createMarksRecord } from '../api/marksApi';
import { fetchAlerts } from '../api/alertsApi';
import { fetchReports, createStudentReport } from '../api/reportsApi';
import { fetchMyFacultyAssignments } from '../api/facultyAssignmentApi';
import { fetchDepartments } from '../api/departmentApi';
import { fetchPrograms } from '../api/programApi';
import { fetchBatches } from '../api/batchApi';

export const AppContext = createContext(null);

const mapStudentsWithStats = (students, attendanceRecords, marksRecords) => {
  return students.map((student) => {
    const studentAttendance = attendanceRecords.filter((record) => record.studentId === student.id);
    const studentMarks = marksRecords.filter((record) => record.studentId === student.id);

    const presentCount = studentAttendance.filter((record) => record.status === 'present').length;
    const attendancePercentage = studentAttendance.length
      ? Math.round((presentCount / studentAttendance.length) * 100)
      : 0;

    const marksAverage = studentMarks.length
      ? Math.round(
          studentMarks.reduce((sum, record) => sum + (Number(record.marksObtained) / Number(record.maxMarks)) * 100, 0) /
            studentMarks.length
        )
      : 0;

    let status = 'New';

    if (attendancePercentage < 75 && studentAttendance.length > 0) {
      status = 'At Risk';
    } else if (attendancePercentage >= 75 && studentAttendance.length > 0) {
      status = 'On Track';
    }

    return {
      ...student,
      attendancePercentage,
      marksAverage,
      status
    };
  });
};

const mapDepartment = (department) => ({
  id: department._id,
  name: department.name,
  code: department.code,
  description: department.description || ''
});

const mapProgram = (program) => ({
  id: program._id,
  name: program.name,
  code: program.code,
  departmentId: program.department?._id || program.department || '',
  departmentName: program.department?.name || '',
  totalSemesters: program.totalSemesters || 0
});

const mapBatch = (batch) => ({
  id: batch._id,
  name: batch.name,
  section: batch.section || '',
  semester: batch.semester,
  academicYear: batch.academicYear,
  departmentId: batch.department?._id || batch.department || '',
  programId: batch.program?._id || batch.program || '',
  programName: batch.program?.name || '',
  programCode: batch.program?.code || ''
});

const mapStudent = (student) => ({
  id: student._id,
  name: student.name,
  rollNumber: student.rollNumber,
  department: student.department,
  departmentId: student.departmentRef?._id || '',
  departmentName: student.departmentRef?.name || student.department,
  semester: student.semester,
  section: student.section || '',
  email: student.email || '',
  faceLabel: student.faceLabel || '',
  profileImage: student.profileImage || '',
  programId: student.program?._id || '',
  programName: student.program?.name || '',
  batchId: student.batch?._id || '',
  batchName: student.batch?.name || '',
  batchSection: student.batch?.section || '',
  academicYear: student.academicYear || student.batch?.academicYear || ''
});

const mapAttendance = (record) => ({
  id: record._id,
  studentId: record.student?._id || '',
  studentName: record.student?.name || 'Unknown Student',
  subject: record.subject,
  status: record.status,
  source: record.source,
  date: new Date(record.date).toISOString().split('T')[0],
  facultyAssignmentId: record.facultyAssignment?._id || '',
  assignmentLabel: record.facultyAssignment
    ? `${record.facultyAssignment.program?.code || record.facultyAssignment.program?.name || ''} • ${record.facultyAssignment.subject?.name || record.subject} • ${record.facultyAssignment.batch?.name || 'Batch'}`
    : ''
});

const mapMarks = (record) => ({
  id: record._id,
  studentId: record.student?._id || '',
  subject: record.subject,
  examType: record.examType,
  marksObtained: record.marksObtained,
  maxMarks: record.maxMarks,
  semester: record.semester
});

const mapAlert = (alert) => ({
  id: alert._id,
  title: alert.title,
  message: alert.message,
  severity: alert.severity,
  studentName: alert.student?.name || 'Unknown Student'
});

const mapReport = (report) => ({
  id: report._id,
  studentId: report.student?._id || report.student,
  studentName: report.student?.name || 'Unknown Student',
  englishComment: report.englishComment,
  hindiComment: report.hindiComment
});

const mapFacultyAssignment = (assignment) => ({
  id: assignment._id,
  semester: assignment.semester,
  academicYear: assignment.academicYear,
  isClassTeacher: assignment.isClassTeacher,
  departmentId: assignment.department?._id || '',
  departmentName: assignment.department?.name || '',
  programId: assignment.program?._id || '',
  programName: assignment.program?.name || '',
  programCode: assignment.program?.code || '',
  subjectId: assignment.subject?._id || '',
  subjectName: assignment.subject?.name || '',
  subjectCode: assignment.subject?.code || '',
  batchId: assignment.batch?._id || '',
  batchName: assignment.batch?.name || '',
  batchSection: assignment.batch?.section || '',
  label: `${assignment.program?.code || assignment.program?.name || 'Program'} • ${assignment.subject?.name || 'Subject'} • ${assignment.batch?.name || 'Batch'}`
});

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [students, setStudents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [reports, setReports] = useState([]);
  const [facultyAssignments, setFacultyAssignments] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [batches, setBatches] = useState([]);
  const [recognitionResult, setRecognitionResult] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [attendanceLoading, setAttendanceLoading] = useState({
    manual: false,
    recognize: false,
    saveRecognized: false
  });
  const [errorMessage, setErrorMessage] = useState('');

  const loadProtectedData = async () => {
    setIsLoading(true);

    try {
      const [
        studentsResponse,
        attendanceResponse,
        marksResponse,
        alertsResponse,
        reportsResponse,
        assignmentsResponse,
        departmentsResponse,
        programsResponse,
        batchesResponse
      ] = await Promise.all([
        fetchStudents(),
        fetchAttendanceRecords(),
        fetchMarksRecords(),
        fetchAlerts(),
        fetchReports(),
        fetchMyFacultyAssignments(),
        fetchDepartments(),
        fetchPrograms(),
        fetchBatches()
      ]);

      const mappedAttendance = attendanceResponse.attendanceRecords.map(mapAttendance);
      const mappedMarks = marksResponse.marksRecords.map(mapMarks);
      const mappedStudents = mapStudentsWithStats(
        studentsResponse.students.map(mapStudent),
        mappedAttendance,
        mappedMarks
      );
      const mappedAlerts = alertsResponse.alerts.map(mapAlert);
      const mappedReports = reportsResponse.reports.map(mapReport);
      const mappedAssignments = (assignmentsResponse.assignments || []).map(mapFacultyAssignment);
      const mappedDepartments = (departmentsResponse.departments || []).map(mapDepartment);
      const mappedPrograms = (programsResponse.programs || []).map(mapProgram);
      const mappedBatches = (batchesResponse.batches || []).map(mapBatch);

      setStudents(mappedStudents);
      setAttendance(mappedAttendance);
      setMarks(mappedMarks);
      setAlerts(mappedAlerts);
      setReports(mappedReports);
      setFacultyAssignments(mappedAssignments);
      setDepartments(mappedDepartments);
      setPrograms(mappedPrograms);
      setBatches(mappedBatches);
      setErrorMessage('');
    } catch (error) {
      setErrorMessage(error.message || 'Unable to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const bootstrapApp = async () => {
      const token = localStorage.getItem('edutrack_token');

      if (!token) {
        return;
      }

      try {
        const response = await getCurrentUser();
        setCurrentUser(response.user);
        setIsLoggedIn(true);
        await loadProtectedData();
      } catch (error) {
        removeToken();
        setIsLoggedIn(false);
      }
    };

    bootstrapApp();
  }, []);

  const login = async (credentials) => {
    setAuthLoading(true);
    setErrorMessage('');

    try {
      const response = await loginUser(credentials);
      saveToken(response.token);
      setCurrentUser(response.user);
      setIsLoggedIn(true);
      await loadProtectedData();
      return true;
    } catch (error) {
      setErrorMessage(error.message || 'Login failed');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const register = async (userData) => {
    setAuthLoading(true);
    setErrorMessage('');

    try {
      const response = await registerUser(userData);
      saveToken(response.token);
      setCurrentUser(response.user);
      setIsLoggedIn(true);
      await loadProtectedData();
      return true;
    } catch (error) {
      setErrorMessage(error.message || 'Registration failed');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = () => {
    removeToken();
    setIsLoggedIn(false);
    setActivePage('dashboard');
    setCurrentUser(null);
    setStudents([]);
    setAttendance([]);
    setMarks([]);
    setAlerts([]);
    setReports([]);
    setFacultyAssignments([]);
    setDepartments([]);
    setPrograms([]);
    setBatches([]);
    setRecognitionResult(null);
  };

  const addStudent = async (studentData) => {
    setErrorMessage('');

    try {
      await createStudent({
        ...studentData,
        semester: Number(studentData.semester)
      });
      await loadProtectedData();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to add student');
    }
  };

  const addAttendanceRecord = async (recordData) => {
    setErrorMessage('');
    setAttendanceLoading((previousState) => ({
      ...previousState,
      manual: true
    }));

    try {
      await createAttendanceRecord({
        studentId: recordData.studentId,
        subject: recordData.subject,
        status: recordData.status,
        date: recordData.date,
        source: recordData.source,
        recognitionConfidence: recordData.recognitionConfidence,
        facultyAssignmentId: recordData.facultyAssignmentId
      });
      await loadProtectedData();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save attendance');
    } finally {
      setAttendanceLoading((previousState) => ({
        ...previousState,
        manual: false
      }));
    }
  };

  const runAttendanceRecognition = async ({ imageFile, facultyAssignmentId }) => {
    setErrorMessage('');
    setAttendanceLoading((previousState) => ({
      ...previousState,
      recognize: true
    }));

    try {
      const response = await recognizeAttendanceImage({ imageFile, facultyAssignmentId });
      setRecognitionResult(response.recognitionResult);
      return response.recognitionResult;
    } catch (error) {
      setErrorMessage(error.message || 'Unable to recognize attendance image');
      return null;
    } finally {
      setAttendanceLoading((previousState) => ({
        ...previousState,
        recognize: false
      }));
    }
  };

  const saveRecognizedAttendance = async ({ subject, date, facultyAssignmentId }) => {
    if (!recognitionResult?.matchedStudents?.length) {
      setErrorMessage('No recognized students found to save');
      return;
    }

    setErrorMessage('');
    setAttendanceLoading((previousState) => ({
      ...previousState,
      saveRecognized: true
    }));

    try {
      for (const matchedStudent of recognitionResult.matchedStudents) {
        await createAttendanceRecord({
          studentId: matchedStudent.studentId,
          subject,
          status: 'present',
          date,
          source: 'photo',
          recognitionConfidence: matchedStudent.confidence,
          facultyAssignmentId
        });
      }

      await loadProtectedData();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save recognized attendance');
    } finally {
      setAttendanceLoading((previousState) => ({
        ...previousState,
        saveRecognized: false
      }));
    }
  };

  const addMarksRecord = async (markData) => {
    setErrorMessage('');

    try {
      await createMarksRecord({
        studentId: markData.studentId,
        subject: markData.subject,
        examType: String(markData.examType).toLowerCase(),
        marksObtained: Number(markData.marksObtained),
        maxMarks: Number(markData.maxMarks),
        semester: Number(markData.semester)
      });
      await loadProtectedData();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to save marks');
    }
  };

  const generateReport = async (studentId) => {
    setErrorMessage('');

    try {
      await createStudentReport(studentId);
      await loadProtectedData();
    } catch (error) {
      setErrorMessage(error.message || 'Unable to generate report');
    }
  };

  const dashboardStats = useMemo(() => {
    return {
      totalStudents: students.length,
      alertCount: alerts.length,
      attendanceAverage: students.length
        ? Math.round(students.reduce((sum, student) => sum + student.attendancePercentage, 0) / students.length)
        : 0,
      reportsGenerated: reports.length
    };
  }, [students, alerts, reports]);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        activePage,
        setActivePage,
        currentUser,
        students,
        alerts,
        marks,
        attendance,
        reports,
        facultyAssignments,
        departments,
        programs,
        batches,
        recognitionResult,
        dashboardStats,
        isLoading,
        authLoading,
        attendanceLoading,
        errorMessage,
        login,
        register,
        logout,
        addStudent,
        addAttendanceRecord,
        runAttendanceRecognition,
        saveRecognizedAttendance,
        addMarksRecord,
        generateReport,
        reloadAppData: loadProtectedData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
