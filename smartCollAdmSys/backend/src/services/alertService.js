const Alert = require('../models/Alert');
const Student = require('../models/Student');

// This function creates or updates an attendance shortage alert.
const createAttendanceAlertIfNeeded = async (studentId, subject, percentage) => {
    if (percentage >= 75) {
        return null;
    }

    const student = await Student.findById(studentId);

    if (!student) {
        return null;
    }

    const existingAlert = await Alert.findOne({
        student: studentId,
        type: 'attendance_shortage',
        relatedSubject: subject,
        status: 'active'
    });

    const title = 'Attendance shortage warning';
    const message = `${student.name} has only ${percentage}% attendance in ${subject}. Immediate attention is required.`;

    if (existingAlert) {
        existingAlert.message = message;
        existingAlert.currentValue = percentage;
        existingAlert.severity = percentage < 60 ? 'high' : 'medium';
        await existingAlert.save();
        return existingAlert;
    }

    return Alert.create({
        student: studentId,
        type: 'attendance_shortage',
        title,
        message,
        severity: percentage < 60 ? 'high' : 'medium',
        relatedSubject: subject,
        currentValue: percentage,
        threshold: 75
    });
};

// This function returns all active alerts with student information.
const getActiveAlerts = async () => {
    return Alert.find({ status: 'active' }).populate('student', 'name rollNumber department semester');
};

module.exports = {
    createAttendanceAlertIfNeeded,
    getActiveAlerts
};
