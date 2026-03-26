const jwt = require('jsonwebtoken');
const env = require('../config/env');

// This helper creates a signed JWT token for authenticated users.
const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id,
            role: user.role,
            email: user.email
        },
        env.jwtSecret,
        {
            expiresIn: env.jwtExpiresIn
        }
    );
};

module.exports = generateToken;
