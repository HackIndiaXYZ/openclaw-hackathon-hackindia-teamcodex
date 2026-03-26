const Marks = require('../models/Marks');
const Student = require('../models/Student');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const addMarks = async (req, res) => {
    try {
        const { studentId, subject, examType, marksObtained, maxMarks, semester } = req.body;

        if (!studentId || !subject || !examType || marksObtained === undefined || !maxMarks || !semester) {
            return sendError(res, 400, 'Student, subject, exam type, marks, max marks and semester are required');
        }

        const student = await Student.findById(studentId);

        if (!student) {
            return sendError(res, 404, 'Student not found');
        }

        const marks = await Marks.create({
            student: studentId,
            subject,
            examType,
            marksObtained,
            maxMarks,
            semester,
            recordedBy: req.user?._id
        });

        return sendSuccess(res, 201, 'Marks added successfully', { marks });
    } catch (error) {
        console.error('addMarks error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const getStudentMarks = async (req, res) => {
    try {
        const { studentId } = req.params;
        const marksRecords = await Marks.find({ student: studentId }).sort({ createdAt: -1 });

        return sendSuccess(res, 200, 'Marks fetched successfully', { marksRecords });
    } catch (error) {
        console.error('getStudentMarks error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const getAllMarks = async (req, res) => {
    try {
        const marksRecords = await Marks.find()
            .populate('student', 'name rollNumber department semester')
            .sort({ createdAt: -1 });

        return sendSuccess(res, 200, 'All marks fetched successfully', { marksRecords });
    } catch (error) {
        console.error('getAllMarks error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

module.exports = {
    addMarks,
    getStudentMarks,
    getAllMarks
};
