const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        code: {
            type: String,
            required: true,
            trim: true,
            uppercase: true
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
        semester: {
            type: Number,
            required: true,
            min: 1
        },
        credits: {
            type: Number,
            min: 0,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Same subject code should not repeat in the same program and semester.
subjectSchema.index({ program: 1, semester: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Subject', subjectSchema);
