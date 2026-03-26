const Report = require('../models/Report');
const { generateStudentReport } = require('../services/reportService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const generateReport = async (req, res) => {
    try {
        const { studentId } = req.params;
        const report = await generateStudentReport(studentId, req.user?._id);

        return sendSuccess(res, 201, 'Report generated successfully', { report });
    } catch (error) {
        console.error('generateReport error:', error.message);

        if (error.message === 'Student not found') {
            return sendError(res, 404, 'Student not found');
        }

        return sendError(res, 500, 'Internal server error');
    }
};

const getStudentReports = async (req, res) => {
    try {
        const { studentId } = req.params;
        const reports = await Report.find({ student: studentId }).sort({ createdAt: -1 });

        return sendSuccess(res, 200, 'Reports fetched successfully', { reports });
    } catch (error) {
        console.error('getStudentReports error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find()
            .populate('student', 'name rollNumber department semester')
            .sort({ createdAt: -1 });

        return sendSuccess(res, 200, 'All reports fetched successfully', { reports });
    } catch (error) {
        console.error('getAllReports error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

module.exports = {
    generateReport,
    getStudentReports,
    getAllReports
};
