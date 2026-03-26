const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        rollNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            default: ''
        },

        // Legacy text field kept for backward compatibility with the current UI.
        department: {
            type: String,
            required: true,
            trim: true
        },

        // New academic structure fields.
        departmentRef: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department',
            default: null
        },
        program: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Program',
            default: null
        },
        batch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Batch',
            default: null
        },
        academicYear: {
            type: String,
            trim: true,
            default: ''
        },

        semester: {
            type: Number,
            required: true,
            min: 1
        },
        section: {
            type: String,
            trim: true,
            default: ''
        },
        parentName: {
            type: String,
            trim: true,
            default: ''
        },
        parentContact: {
            type: String,
            trim: true,
            default: ''
        },
        profileImage: {
            type: String,
            default: ''
        },
        faceLabel: {
            type: String,
            default: ''
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

module.exports = mongoose.model('Student', studentSchema);
