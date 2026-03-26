const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true
        },
        subject: {
            type: String,
            required: true,
            trim: true
        },
        examType: {
            type: String,
            enum: ['internal', 'midsem', 'practical', 'final'],
            required: true
        },
        marksObtained: {
            type: Number,
            required: true,
            min: 0
        },
        maxMarks: {
            type: Number,
            required: true,
            min: 1
        },
        semester: {
            type: Number,
            required: true,
            min: 1
        },
        recordedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Marks', marksSchema);
