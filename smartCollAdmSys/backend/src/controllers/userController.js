const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .populate('departmentIds', 'name code')
            .sort({ createdAt: -1 });

        return sendSuccess(res, 200, 'Users fetched successfully', { users });
    } catch (error) {
        console.error('getUsers error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password, role, department, employeeId, departmentIds } = req.body;

        if (!name || !email || !password) {
            return sendError(res, 400, 'Name, email and password are required');
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return sendError(res, 409, 'User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'professor',
            department: department || '',
            employeeId: employeeId || '',
            departmentIds: Array.isArray(departmentIds) ? departmentIds : []
        });

        const populatedUser = await User.findById(user._id)
            .select('-password')
            .populate('departmentIds', 'name code');

        return sendSuccess(res, 201, 'User created successfully', { user: populatedUser });
    } catch (error) {
        console.error('createUser error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { name, email, password, role, department, employeeId, isActive, departmentIds } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return sendError(res, 404, 'User not found');
        }

        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email.toLowerCase();
        if (password) user.password = password;
        if (role !== undefined) user.role = role;
        if (department !== undefined) user.department = department;
        if (employeeId !== undefined) user.employeeId = employeeId;
        if (isActive !== undefined) user.isActive = Boolean(isActive);
        if (departmentIds !== undefined) user.departmentIds = Array.isArray(departmentIds) ? departmentIds : [];

        await user.save();

        const updatedUser = await User.findById(userId)
            .select('-password')
            .populate('departmentIds', 'name code');

        return sendSuccess(res, 200, 'User updated successfully', { user: updatedUser });
    } catch (error) {
        console.error('updateUser error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser
};
