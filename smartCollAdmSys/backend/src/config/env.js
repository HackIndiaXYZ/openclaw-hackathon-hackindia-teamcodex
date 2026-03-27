const dotenv = require('dotenv');

dotenv.config();

const corsOriginValue = process.env.CORS_ORIGIN || 'http://localhost:5173';
const allowedOrigins = corsOriginValue
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

const env = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smartcolladmsys',
    corsOrigin: corsOriginValue,
    allowedOrigins,
    jwtSecret: process.env.JWT_SECRET || 'smartcolladminsecret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    pythonServiceUrl: process.env.PYTHON_SERVICE_URL || 'http://127.0.0.1:8000'
};

module.exports = env;
