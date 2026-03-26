const Attendance = require('../models/Attendance');

// This helper calculates percentage attendance for one student in one subject.
const calculateAttendancePercentage = async (studentId, subject) => {
    const filter = { student: studentId };

    if (subject) {
        filter.subject = subject;
    }

    const records = await Attendance.find(filter);

    if (records.length === 0) {
        return 0;
    }

    const presentCount = records.filter((record) => record.status === 'present').length;
    return Number(((presentCount / records.length) * 100).toFixed(2));
};

module.exports = {
    calculateAttendancePercentage
};
