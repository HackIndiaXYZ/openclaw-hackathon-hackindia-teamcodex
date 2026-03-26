const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// This helper keeps auth response shape the same in login and register.
const buildAuthResponse = (user, token) => ({
    token,
    user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
    }
});

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, department } = req.body;

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
            role,
            department
        });

        const token = generateToken(user);

        return sendSuccess(res, 201, 'User registered successfully', buildAuthResponse(user, token));
    } catch (error) {
        console.error('registerUser error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return sendError(res, 400, 'Email and password are required');
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return sendError(res, 401, 'Invalid email or password');
        }

        const isPasswordCorrect = await user.comparePassword(password);

        if (!isPasswordCorrect) {
            return sendError(res, 401, 'Invalid email or password');
        }

        const token = generateToken(user);

        return sendSuccess(res, 200, 'User logged in successfully', buildAuthResponse(user, token));
    } catch (error) {
        console.error('loginUser error:', error.message);
        return sendError(res, 500, 'Internal server error');
    }
};

const getCurrentUser = async (req, res) => {
    return sendSuccess(res, 200, 'Current user fetched successfully', {
        user: req.user
    });
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser
};
