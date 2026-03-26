const mongoose = require('mongoose');
const env = require('./env');

// This function connects our backend with MongoDB.
// We keep it in a separate file so the server file stays clean.
const dbConnection = async () => {
    try {
        await mongoose.connect(env.mongoUri);
        console.log('Database connection is successful');
    } catch (error) {
        console.error('Database connection error:', error.message);
        throw error;
    }
};

module.exports = dbConnection;
