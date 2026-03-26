const Program = require('../models/Program');
const Department = require('../models/Department');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const createProgram = async (req, res) => {
    try {
        const { name, code, departmentId, totalSemesters } = req.body;

        if (!name || !code || !departmentId) {
            return sendError(res, 400, 'Program name, code and department are required');
        }

        const department = await Department.findById(departmentId);

        if (!department) {
            return sendError(res, 404, 'Department not found');
        }

        const program = await Program.create({
            name,
            code,
            department: departmentId,
            totalSemesters: totalSemesters || 6
        });

        return sendSuccess(res, 201, 'Program created successfully', { program });
    } catch (error) {
        console.error('createProgram error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const getPrograms = async (req, res) => {
    try {
        const filter = {};

        if (req.query.departmentId) {
            filter.department = req.query.departmentId;
        }

        const programs = await Program.find(filter)
            .populate('department', 'name code')
            .sort({ name: 1 });

        return sendSuccess(res, 200, 'Programs fetched successfully', { programs });
    } catch (error) {
        console.error('getPrograms error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const updateProgram = async (req, res) => {
    try {
        const { programId } = req.params;
        const { name, code, departmentId, totalSemesters, isActive } = req.body;

        const program = await Program.findById(programId);

        if (!program) {
            return sendError(res, 404, 'Program not found');
        }

        if (departmentId) {
            const department = await Department.findById(departmentId);

            if (!department) {
                return sendError(res, 404, 'Department not found');
            }

            program.department = departmentId;
        }

        if (name !== undefined) program.name = name;
        if (code !== undefined) program.code = code;
        if (totalSemesters !== undefined) program.totalSemesters = Number(totalSemesters);
        if (isActive !== undefined) program.isActive = Boolean(isActive);

        await program.save();

        const updatedProgram = await Program.findById(programId).populate('department', 'name code');

        return sendSuccess(res, 200, 'Program updated successfully', { program: updatedProgram });
    } catch (error) {
        console.error('updateProgram error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

module.exports = {
    createProgram,
    getPrograms,
    updateProgram
};
