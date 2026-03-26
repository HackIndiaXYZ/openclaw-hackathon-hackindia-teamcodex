const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema(
    {
        name: {
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
        section: {
            type: String,
            trim: true,
            uppercase: true,
            default: ''
        },
        academicYear: {
            type: String,
            trim: true,
            required: true
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

// One batch should be unique inside a program, semester and academic year.
batchSchema.index({ program: 1, semester: 1, name: 1, academicYear: 1 }, { unique: true });

module.exports = mongoose.model('Batch', batchSchema);
