const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const FacultyAssignment = require('../models/FacultyAssignment');
const { calculateAttendancePercentage } = require('../utils/attendanceCalculator');
const { createAttendanceAlertIfNeeded } = require('../services/alertService');
const { recognizeAttendanceFromImage } = require('../services/attendanceService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getAssignmentFilter = async ({ facultyAssignmentId, userId }) => {
    if (!facultyAssignmentId) {
        return null;
    }

    // We make sure the selected assignment really belongs to the current user.
    const assignment = await FacultyAssignment.findOne({
        _id: facultyAssignmentId,
        faculty: userId,
        isActive: true
    }).populate('department', 'name code').populate('program', 'name code').populate('subject', 'name code').populate('batch', 'name section semester academicYear');

    return assignment;
};

const addAttendance = async (req, res) => {
    try {
        const { studentId, subject, status, date, source, recognitionConfidence, facultyAssignmentId } = req.body;

        if (!studentId || !subject || !status) {
            return sendError(res, 400, 'Student, subject and status are required');
        }

        const student = await Student.findById(studentId);

        if (!student) {
            return sendError(res, 404, 'Student not found');
        }

        let assignment = null;

        if (facultyAssignmentId) {
            assignment = await getAssignmentFilter({
                facultyAssignmentId,
                userId: req.user?._id
            });

            if (!assignment) {
                return sendError(res, 404, 'Selected faculty assignment not found for this professor');
            }
        }

        const attendance = await Attendance.create({
            student: studentId,
            facultyAssignment: assignment?._id || null,
            subject,
            status,
            date: date || new Date(),
            source,
            recognitionConfidence,
            capturedBy: req.user?._id
        });

        const attendancePercentage = await calculateAttendancePercentage(studentId, subject);
        const alert = await createAttendanceAlertIfNeeded(studentId, subject, attendancePercentage);

        return sendSuccess(res, 201, 'Attendance added successfully', {
            attendance,
            attendancePercentage,
            alert
        });
    } catch (error) {
        console.error('addAttendance error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const recognizeAttendance = async (req, res) => {
    try {
        if (!req.file) {
            return sendError(res, 400, 'Please upload a classroom image');
        }

        const { facultyAssignmentId } = req.body;
        let studentFilter = {};

        if (facultyAssignmentId) {
            const assignment = await getAssignmentFilter({
                facultyAssignmentId,
                userId: req.user?._id
            });

            if (!assignment) {
                return sendError(res, 404, 'Selected faculty assignment not found for this professor');
            }

            // We keep the recognition roster limited to the selected class only.
            studentFilter = {
                batch: assignment.batch?._id || null,
                semester: assignment.semester,
                program: assignment.program?._id || null
            };
        }

        const students = await Student.find(studentFilter).select('name faceLabel batch semester program');
        const roster = students.map((student) => ({
            studentId: student._id.toString(),
            name: student.name,
            faceLabel: student.faceLabel || ''
        }));

        const recognitionResult = await recognizeAttendanceFromImage({
            fileBuffer: req.file.buffer,
            fileName: req.file.originalname,
            mimeType: req.file.mimetype,
            roster
        });

        return sendSuccess(res, 200, 'Attendance recognition completed successfully', {
            recognitionResult
        });
    } catch (error) {
        console.error('recognizeAttendance error:', error.message);
        return sendError(res, 500, error.message || 'Unable to recognize attendance');
    }
};

const getAttendanceSummary = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { subject } = req.query;

        const student = await Student.findById(studentId);

        if (!student) {
            return sendError(res, 404, 'Student not found');
        }

        const filter = { student: studentId };

        if (subject) {
            filter.subject = subject;
        }

        const attendanceRecords = await Attendance.find(filter).sort({ date: -1 });
        const attendancePercentage = await calculateAttendancePercentage(studentId, subject);

        return sendSuccess(res, 200, 'Attendance summary fetched successfully', {
            student,
            attendancePercentage,
            totalClasses: attendanceRecords.length,
            attendanceRecords
        });
    } catch (error) {
        console.error('getAttendanceSummary error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const getAttendanceRecords = async (req, res) => {
    try {
        const { facultyAssignmentId } = req.query;
        const filter = {};

        if (facultyAssignmentId) {
            filter.facultyAssignment = facultyAssignmentId;
        }

        const attendanceRecords = await Attendance.find(filter)
            .populate('student', 'name rollNumber department semester section batch program')
            .populate({
                path: 'facultyAssignment',
                populate: [
                    { path: 'department', select: 'name code' },
                    { path: 'program', select: 'name code' },
                    { path: 'subject', select: 'name code semester' },
                    { path: 'batch', select: 'name section semester academicYear' }
                ]
            })
            .sort({ date: -1, createdAt: -1 });

        return sendSuccess(res, 200, 'Attendance records fetched successfully', {
            attendanceRecords
        });
    } catch (error) {
        console.error('getAttendanceRecords error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

module.exports = {
    addAttendance,
    recognizeAttendance,
    getAttendanceSummary,
    getAttendanceRecords
};
