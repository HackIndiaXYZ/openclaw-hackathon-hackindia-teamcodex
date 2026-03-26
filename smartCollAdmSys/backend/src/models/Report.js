const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        semester: {
            type: Number,
            required: true
        },
        attendancePercentage: {
            type: Number,
            default: 0
        },
        performanceAverage: {
            type: Number,
            default: 0
        },
        englishComment: {
            type: String,
            required: true
        },
        hindiComment: {
            type: String,
            required: true
        },
        generatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Report', reportSchema);
