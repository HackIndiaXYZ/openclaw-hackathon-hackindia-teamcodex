const app = require('./app');
const env = require('./config/env');
const dbConnection = require('./config/db');

// We start the server only after the database connection succeeds.
// This avoids many runtime errors later.
const startServer = async () => {
    try {
        await dbConnection();

        app.listen(env.port, () => {
            console.log(`Server is running on port ${env.port}`);
        });
    } catch (error) {
        console.error('Server start error:', error.message);
        process.exit(1);
    }
};

startServer();
