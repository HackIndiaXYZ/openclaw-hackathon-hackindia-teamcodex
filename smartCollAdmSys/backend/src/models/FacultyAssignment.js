const mongoose = require('mongoose');

const facultyAssignmentSchema = new mongoose.Schema(
    {
        faculty: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
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
        semester: {
            type: Number,
            required: true,
            min: 1
        },
        academicYear: {
            type: String,
            trim: true,
            required: true
        },
        isClassTeacher: {
            type: Boolean,
            default: false
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

// Same faculty should not get duplicate assignments for the same batch and subject.
facultyAssignmentSchema.index(
    { faculty: 1, subject: 1, batch: 1, academicYear: 1 },
    { unique: true }
);

module.exports = mongoose.model('FacultyAssignment', facultyAssignmentSchema);
