// This file keeps sample data in one place so the UI can be built fast.
export const initialStudents = [
  {
    id: 'stu-101',
    name: 'Rahul Verma',
    rollNumber: 'CSE001',
    department: 'Computer Science',
    semester: 5,
    section: 'A',
    email: 'rahul@college.edu',
    attendancePercentage: 71,
    marksAverage: 68,
    status: 'At Risk'
  },
  {
    id: 'stu-102',
    name: 'Aditi Singh',
    rollNumber: 'CSE002',
    department: 'Computer Science',
    semester: 5,
    section: 'A',
    email: 'aditi@college.edu',
    attendancePercentage: 88,
    marksAverage: 84,
    status: 'On Track'
  },
  {
    id: 'stu-103',
    name: 'Neha Kumari',
    rollNumber: 'CSE003',
    department: 'Computer Science',
    semester: 5,
    section: 'A',
    email: 'neha@college.edu',
    attendancePercentage: 79,
    marksAverage: 76,
    status: 'Stable'
  },
  {
    id: 'stu-104',
    name: 'Karan Patel',
    rollNumber: 'CSE004',
    department: 'Computer Science',
    semester: 5,
    section: 'A',
    email: 'karan@college.edu',
    attendancePercentage: 64,
    marksAverage: 58,
    status: 'At Risk'
  }
];

export const initialAlerts = [
  {
    id: 'alert-1',
    title: '75% rule warning',
    message: 'Rahul Verma has dropped to 71% attendance in DBMS.',
    severity: 'medium',
    studentName: 'Rahul Verma'
  },
  {
    id: 'alert-2',
    title: 'Urgent attention needed',
    message: 'Karan Patel is below 65% attendance and needs immediate counseling.',
    severity: 'high',
    studentName: 'Karan Patel'
  }
];

export const initialMarks = [
  {
    id: 'mark-1',
    studentId: 'stu-101',
    subject: 'DBMS',
    examType: 'Internal',
    marksObtained: 34,
    maxMarks: 50,
    semester: 5
  },
  {
    id: 'mark-2',
    studentId: 'stu-102',
    subject: 'DBMS',
    examType: 'Internal',
    marksObtained: 43,
    maxMarks: 50,
    semester: 5
  },
  {
    id: 'mark-3',
    studentId: 'stu-103',
    subject: 'Operating Systems',
    examType: 'Internal',
    marksObtained: 38,
    maxMarks: 50,
    semester: 5
  }
];

export const initialAttendance = [
  {
    id: 'att-1',
    studentId: 'stu-101',
    studentName: 'Rahul Verma',
    subject: 'DBMS',
    status: 'present',
    source: 'photo',
    date: '2026-03-25'
  },
  {
    id: 'att-2',
    studentId: 'stu-102',
    studentName: 'Aditi Singh',
    subject: 'DBMS',
    status: 'present',
    source: 'photo',
    date: '2026-03-25'
  },
  {
    id: 'att-3',
    studentId: 'stu-104',
    studentName: 'Karan Patel',
    subject: 'DBMS',
    status: 'absent',
    source: 'manual',
    date: '2026-03-24'
  }
];

export const initialReports = [
  {
    id: 'rep-1',
    studentId: 'stu-101',
    studentName: 'Rahul Verma',
    englishComment: 'Rahul has shown improvement in internal assessments but requires consistent attendance to avoid academic risk.',
    hindiComment: 'Rahul ne internal assessments mein sudhar dikhaya hai, lekin academic risk se bachne ke liye regular attendance zaruri hai.'
  }
];

export const navItems = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'students', label: 'Students' },
  { id: 'attendance', label: 'Attendance' },
  { id: 'marks', label: 'Marks' },
  { id: 'reports', label: 'Reports' }
];
