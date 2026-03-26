// This file loads environment variables once when the server starts.
// Keeping it separate makes the setup easier to understand and reuse.
const dotenv = require('dotenv');

dotenv.config();

const env = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartcolladmsys',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    jwtSecret: process.env.JWT_SECRET || 'smartcolladminsecret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    pythonServiceUrl: process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:8000'
};

module.exports = env;
