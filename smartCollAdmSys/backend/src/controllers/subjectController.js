const Subject = require('../models/Subject');
const Department = require('../models/Department');
const Program = require('../models/Program');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const createSubject = async (req, res) => {
    try {
        const { name, code, departmentId, programId, semester, credits } = req.body;

        if (!name || !code || !departmentId || !programId || !semester) {
            return sendError(res, 400, 'Subject name, code, department, program and semester are required');
        }

        const department = await Department.findById(departmentId);
        const program = await Program.findById(programId);

        if (!department) {
            return sendError(res, 404, 'Department not found');
        }

        if (!program) {
            return sendError(res, 404, 'Program not found');
        }

        const subject = await Subject.create({
            name,
            code,
            department: departmentId,
            program: programId,
            semester,
            credits: credits || 0
        });

        return sendSuccess(res, 201, 'Subject created successfully', { subject });
    } catch (error) {
        console.error('createSubject error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const getSubjects = async (req, res) => {
    try {
        const filter = {};

        if (req.query.programId) {
            filter.program = req.query.programId;
        }

        if (req.query.semester) {
            filter.semester = Number(req.query.semester);
        }

        const subjects = await Subject.find(filter)
            .populate('department', 'name code')
            .populate('program', 'name code totalSemesters')
            .sort({ semester: 1, name: 1 });

        return sendSuccess(res, 200, 'Subjects fetched successfully', { subjects });
    } catch (error) {
        console.error('getSubjects error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const updateSubject = async (req, res) => {
    try {
        const { subjectId } = req.params;
        const { name, code, departmentId, programId, semester, credits, isActive } = req.body;

        const subject = await Subject.findById(subjectId);

        if (!subject) {
            return sendError(res, 404, 'Subject not found');
        }

        if (departmentId) {
            const department = await Department.findById(departmentId);
            if (!department) {
                return sendError(res, 404, 'Department not found');
            }
            subject.department = departmentId;
        }

        if (programId) {
            const program = await Program.findById(programId);
            if (!program) {
                return sendError(res, 404, 'Program not found');
            }
            subject.program = programId;
        }

        if (name !== undefined) subject.name = name;
        if (code !== undefined) subject.code = code;
        if (semester !== undefined) subject.semester = Number(semester);
        if (credits !== undefined) subject.credits = Number(credits);
        if (isActive !== undefined) subject.isActive = Boolean(isActive);

        await subject.save();

        const updatedSubject = await Subject.findById(subjectId)
            .populate('department', 'name code')
            .populate('program', 'name code totalSemesters');

        return sendSuccess(res, 200, 'Subject updated successfully', { subject: updatedSubject });
    } catch (error) {
        console.error('updateSubject error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

module.exports = {
    createSubject,
    getSubjects,
    updateSubject
};
