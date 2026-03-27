const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const marksRoutes = require('./routes/marksRoutes');
const alertsRoutes = require('./routes/alertsRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const programRoutes = require('./routes/programRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const batchRoutes = require('./routes/batchRoutes');
const facultyAssignmentRoutes = require('./routes/facultyAssignmentRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || env.allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error('CORS origin is not allowed'));
        },
        credentials: true
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Smart College Admin backend is running'
    });
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API health is good'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/batches', batchRoutes);
app.use('/api/faculty-assignments', facultyAssignmentRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/marks', marksRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/reports', reportsRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.use(errorMiddleware);

module.exports = app;
