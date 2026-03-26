const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        type: {
            type: String,
            enum: ['attendance_shortage', 'performance_risk', 'general'],
            default: 'attendance_shortage'
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        severity: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },
        status: {
            type: String,
            enum: ['active', 'resolved'],
            default: 'active'
        },
        relatedSubject: {
            type: String,
            trim: true,
            default: ''
        },
        currentValue: {
            type: Number,
            default: 0
        },
        threshold: {
            type: Number,
            default: 75
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Alert', alertSchema);
