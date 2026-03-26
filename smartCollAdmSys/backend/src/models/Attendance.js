const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        // This links one attendance entry to the selected teaching assignment.
        facultyAssignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FacultyAssignment',
            default: null
        },
        subject: {
            type: String,
            required: true,
            trim: true
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['present', 'absent'],
            required: true
        },
        source: {
            type: String,
            enum: ['manual', 'photo', 'webcam'],
            default: 'manual'
        },
        recognitionConfidence: {
            type: Number,
            default: 0
        },
        capturedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
