import {
  initialAlerts,
  initialAttendance,
  initialMarks,
  initialReports,
  initialStudents
} from '../data/demoData';

// This helper creates small delays so the UI feels closer to a real API.
const wait = (time = 200) => new Promise((resolve) => setTimeout(resolve, time));

export const getInitialAppData = async () => {
  await wait();

  return {
    students: initialStudents,
    alerts: initialAlerts,
    marks: initialMarks,
    attendance: initialAttendance,
    reports: initialReports
  };
};
