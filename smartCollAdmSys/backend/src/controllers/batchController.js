const Batch = require('../models/Batch');
const Department = require('../models/Department');
const Program = require('../models/Program');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const createBatch = async (req, res) => {
    try {
        const { name, departmentId, programId, semester, section, academicYear } = req.body;

        if (!name || !departmentId || !programId || !semester || !academicYear) {
            return sendError(res, 400, 'Batch name, department, program, semester and academic year are required');
        }

        const department = await Department.findById(departmentId);
        const program = await Program.findById(programId);

        if (!department) {
            return sendError(res, 404, 'Department not found');
        }

        if (!program) {
            return sendError(res, 404, 'Program not found');
        }

        const batch = await Batch.create({
            name,
            department: departmentId,
            program: programId,
            semester,
            section,
            academicYear
        });

        return sendSuccess(res, 201, 'Batch created successfully', { batch });
    } catch (error) {
        console.error('createBatch error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const getBatches = async (req, res) => {
    try {
        const filter = {};

        if (req.query.programId) {
            filter.program = req.query.programId;
        }

        if (req.query.semester) {
            filter.semester = Number(req.query.semester);
        }

        const batches = await Batch.find(filter)
            .populate('department', 'name code')
            .populate('program', 'name code')
            .sort({ semester: 1, name: 1 });

        return sendSuccess(res, 200, 'Batches fetched successfully', { batches });
    } catch (error) {
        console.error('getBatches error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const updateBatch = async (req, res) => {
    try {
        const { batchId } = req.params;
        const { name, departmentId, programId, semester, section, academicYear, isActive } = req.body;

        const batch = await Batch.findById(batchId);

        if (!batch) {
            return sendError(res, 404, 'Batch not found');
        }

        if (departmentId) {
            const department = await Department.findById(departmentId);
            if (!department) {
                return sendError(res, 404, 'Department not found');
            }
            batch.department = departmentId;
        }

        if (programId) {
            const program = await Program.findById(programId);
            if (!program) {
                return sendError(res, 404, 'Program not found');
            }
            batch.program = programId;
        }

        if (name !== undefined) batch.name = name;
        if (semester !== undefined) batch.semester = Number(semester);
        if (section !== undefined) batch.section = section;
        if (academicYear !== undefined) batch.academicYear = academicYear;
        if (isActive !== undefined) batch.isActive = Boolean(isActive);

        await batch.save();

        const updatedBatch = await Batch.findById(batchId)
            .populate('department', 'name code')
            .populate('program', 'name code');

        return sendSuccess(res, 200, 'Batch updated successfully', { batch: updatedBatch });
    } catch (error) {
        console.error('updateBatch error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

module.exports = {
    createBatch,
    getBatches,
    updateBatch
};
