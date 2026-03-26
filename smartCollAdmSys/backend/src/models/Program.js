const mongoose = require('mongoose');

const programSchema = new mongoose.Schema(
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
        totalSemesters: {
            type: Number,
            required: true,
            min: 1,
            default: 6
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

// Same program code should not repeat inside the same department.
programSchema.index({ department: 1, code: 1 }, { unique: true });

module.exports = mongoose.model('Program', programSchema);
