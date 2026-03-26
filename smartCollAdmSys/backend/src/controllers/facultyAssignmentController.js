const FacultyAssignment = require('../models/FacultyAssignment');
const Department = require('../models/Department');
const Program = require('../models/Program');
const Subject = require('../models/Subject');
const Batch = require('../models/Batch');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const createFacultyAssignment = async (req, res) => {
    try {
        const {
            facultyId,
            departmentId,
            programId,
            subjectId,
            batchId,
            semester,
            academicYear,
            isClassTeacher
        } = req.body;

        if (!facultyId || !departmentId || !programId || !subjectId || !batchId || !semester || !academicYear) {
            return sendError(res, 400, 'Faculty, department, program, subject, batch, semester and academic year are required');
        }

        const [faculty, department, program, subject, batch] = await Promise.all([
            User.findById(facultyId),
            Department.findById(departmentId),
            Program.findById(programId),
            Subject.findById(subjectId),
            Batch.findById(batchId)
        ]);

        if (!faculty) {
            return sendError(res, 404, 'Faculty not found');
        }

        if (!department || !program || !subject || !batch) {
            return sendError(res, 404, 'Department, program, subject or batch not found');
        }

        const assignment = await FacultyAssignment.create({
            faculty: facultyId,
            department: departmentId,
            program: programId,
            subject: subjectId,
            batch: batchId,
            semester,
            academicYear,
            isClassTeacher: Boolean(isClassTeacher)
        });

        return sendSuccess(res, 201, 'Faculty assignment created successfully', { assignment });
    } catch (error) {
        console.error('createFacultyAssignment error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const getFacultyAssignments = async (req, res) => {
    try {
        const assignments = await FacultyAssignment.find()
            .populate('faculty', 'name email role department employeeId')
            .populate('department', 'name code')
            .populate('program', 'name code')
            .populate('subject', 'name code semester')
            .populate('batch', 'name semester academicYear section')
            .sort({ academicYear: -1, semester: 1 });

        return sendSuccess(res, 200, 'Faculty assignments fetched successfully', { assignments });
    } catch (error) {
        console.error('getFacultyAssignments error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const getMyFacultyAssignments = async (req, res) => {
    try {
        const assignments = await FacultyAssignment.find({ faculty: req.user._id })
            .populate('department', 'name code')
            .populate('program', 'name code')
            .populate('subject', 'name code semester')
            .populate('batch', 'name semester academicYear section')
            .sort({ academicYear: -1, semester: 1 });

        return sendSuccess(res, 200, 'Your faculty assignments fetched successfully', { assignments });
    } catch (error) {
        console.error('getMyFacultyAssignments error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const updateFacultyAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const {
            facultyId,
            departmentId,
            programId,
            subjectId,
            batchId,
            semester,
            academicYear,
            isClassTeacher,
            isActive
        } = req.body;

        const assignment = await FacultyAssignment.findById(assignmentId);

        if (!assignment) {
            return sendError(res, 404, 'Faculty assignment not found');
        }

        if (facultyId) {
            const faculty = await User.findById(facultyId);
            if (!faculty) return sendError(res, 404, 'Faculty not found');
            assignment.faculty = facultyId;
        }

        if (departmentId) {
            const department = await Department.findById(departmentId);
            if (!department) return sendError(res, 404, 'Department not found');
            assignment.department = departmentId;
        }

        if (programId) {
            const program = await Program.findById(programId);
            if (!program) return sendError(res, 404, 'Program not found');
            assignment.program = programId;
        }

        if (subjectId) {
            const subject = await Subject.findById(subjectId);
            if (!subject) return sendError(res, 404, 'Subject not found');
            assignment.subject = subjectId;
        }

        if (batchId) {
            const batch = await Batch.findById(batchId);
            if (!batch) return sendError(res, 404, 'Batch not found');
            assignment.batch = batchId;
        }

        if (semester !== undefined) assignment.semester = Number(semester);
        if (academicYear !== undefined) assignment.academicYear = academicYear;
        if (isClassTeacher !== undefined) assignment.isClassTeacher = Boolean(isClassTeacher);
        if (isActive !== undefined) assignment.isActive = Boolean(isActive);

        await assignment.save();

        const updatedAssignment = await FacultyAssignment.findById(assignmentId)
            .populate('faculty', 'name email role department employeeId')
            .populate('department', 'name code')
            .populate('program', 'name code')
            .populate('subject', 'name code semester')
            .populate('batch', 'name semester academicYear section');

        return sendSuccess(res, 200, 'Faculty assignment updated successfully', { assignment: updatedAssignment });
    } catch (error) {
        console.error('updateFacultyAssignment error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

module.exports = {
    createFacultyAssignment,
    getFacultyAssignments,
    getMyFacultyAssignments,
    updateFacultyAssignment
};
