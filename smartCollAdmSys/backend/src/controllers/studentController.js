const Student = require('../models/Student');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { saveStudentFaceImage } = require('../services/studentImageService');

const createStudent = async (req, res) => {
    try {
        const {
            name,
            rollNumber,
            department,
            semester,
            email,
            section,
            parentName,
            parentContact,
            faceLabel,
            departmentRef,
            program,
            batch,
            academicYear
        } = req.body;

        if (!name || !rollNumber || !department || !semester) {
            return sendError(res, 400, 'Name, roll number, department and semester are required');
        }

        const existingStudent = await Student.findOne({ rollNumber });

        if (existingStudent) {
            return sendError(res, 409, 'Student with this roll number already exists');
        }

        const { savedFileName, savedFaceLabel } = await saveStudentFaceImage({
            file: req.file,
            name,
            rollNumber,
            faceLabel
        });

        const student = await Student.create({
            name,
            rollNumber,
            department,
            semester,
            email,
            section,
            parentName,
            parentContact,
            profileImage: savedFileName,
            faceLabel: savedFaceLabel,
            departmentRef: departmentRef || null,
            program: program || null,
            batch: batch || null,
            academicYear: academicYear || ''
        });

        return sendSuccess(res, 201, 'Student created successfully', { student });
    } catch (error) {
        console.error('createStudent error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const getStudents = async (req, res) => {
    try {
        const { batchId, semester, programId, departmentId } = req.query;
        const filter = {};

        if (batchId) {
            filter.batch = batchId;
        }

        if (semester) {
            filter.semester = Number(semester);
        }

        if (programId) {
            filter.program = programId;
        }

        if (departmentId) {
            filter.departmentRef = departmentId;
        }

        const students = await Student.find(filter)
            .populate('departmentRef', 'name code')
            .populate('program', 'name code')
            .populate('batch', 'name section semester academicYear')
            .sort({ createdAt: -1 });

        return sendSuccess(res, 200, 'Students fetched successfully', { students });
    } catch (error) {
        console.error('getStudents error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const updateStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const {
            name,
            rollNumber,
            department,
            semester,
            email,
            section,
            parentName,
            parentContact,
            faceLabel,
            departmentRef,
            program,
            batch,
            academicYear,
            isActive
        } = req.body;

        const student = await Student.findById(studentId);

        if (!student) {
            return sendError(res, 404, 'Student not found');
        }

        if (req.file) {
            const { savedFileName, savedFaceLabel } = await saveStudentFaceImage({
                file: req.file,
                name: name || student.name,
                rollNumber: rollNumber || student.rollNumber,
                faceLabel: faceLabel || student.faceLabel
            });

            student.profileImage = savedFileName;
            student.faceLabel = savedFaceLabel;
        } else if (faceLabel !== undefined) {
            student.faceLabel = faceLabel;
        }

        if (name !== undefined) student.name = name;
        if (rollNumber !== undefined) student.rollNumber = rollNumber;
        if (department !== undefined) student.department = department;
        if (semester !== undefined) student.semester = Number(semester);
        if (email !== undefined) student.email = email;
        if (section !== undefined) student.section = section;
        if (parentName !== undefined) student.parentName = parentName;
        if (parentContact !== undefined) student.parentContact = parentContact;
        if (departmentRef !== undefined) student.departmentRef = departmentRef || null;
        if (program !== undefined) student.program = program || null;
        if (batch !== undefined) student.batch = batch || null;
        if (academicYear !== undefined) student.academicYear = academicYear;
        if (isActive !== undefined) student.isActive = Boolean(isActive);

        await student.save();

        const updatedStudent = await Student.findById(studentId)
            .populate('departmentRef', 'name code')
            .populate('program', 'name code')
            .populate('batch', 'name section semester academicYear');

        return sendSuccess(res, 200, 'Student updated successfully', { student: updatedStudent });
    } catch (error) {
        console.error('updateStudent error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

module.exports = {
    createStudent,
    getStudents,
    updateStudent
};
