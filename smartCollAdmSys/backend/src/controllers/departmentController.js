const Department = require('../models/Department');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const createDepartment = async (req, res) => {
    try {
        const { name, code, description } = req.body;

        if (!name || !code) {
            return sendError(res, 400, 'Department name and code are required');
        }

        const existingDepartment = await Department.findOne({
            $or: [{ name: name.trim() }, { code: code.trim().toUpperCase() }]
        });

        if (existingDepartment) {
            return sendError(res, 409, 'Department already exists');
        }

        const department = await Department.create({
            name,
            code,
            description
        });

        return sendSuccess(res, 201, 'Department created successfully', { department });
    } catch (error) {
        console.error('createDepartment error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find().sort({ name: 1 });
        return sendSuccess(res, 200, 'Departments fetched successfully', { departments });
    } catch (error) {
        console.error('getDepartments error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const updateDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const { name, code, description, isActive } = req.body;

        const department = await Department.findById(departmentId);

        if (!department) {
            return sendError(res, 404, 'Department not found');
        }

        if (name !== undefined) department.name = name;
        if (code !== undefined) department.code = code;
        if (description !== undefined) department.description = description;
        if (isActive !== undefined) department.isActive = Boolean(isActive);

        await department.save();

        return sendSuccess(res, 200, 'Department updated successfully', { department });
    } catch (error) {
        console.error('updateDepartment error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

module.exports = {
    createDepartment,
    getDepartments,
    updateDepartment
};
