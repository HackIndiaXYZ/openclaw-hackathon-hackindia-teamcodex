const mongoose = require('mongoose');

const attendanceSessionSchema = new mongoose.Schema(
    {
        facultyAssignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FacultyAssignment',
            required: true
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
            required: true
        },
        program: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Program',
            required: true
        },
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Subject',
            required: true
        },
        batch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Batch',
            required: true
        },
        date: {
            type: Date,
            required: true,
            default: Date.now
        },
        source: {
            type: String,
            enum: ['manual', 'photo', 'webcam'],
            default: 'manual'
        },
        classroomImage: {
            type: String,
            default: ''
        },
        capturedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        recognitionSummary: {
            detectedFacesCount: {
                type: Number,
                default: 0
            },
            recognizedFacesCount: {
                type: Number,
                default: 0
            },
            unknownFacesCount: {
                type: Number,
                default: 0
            }
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('AttendanceSession', attendanceSessionSchema);
