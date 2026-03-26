const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        role: {
            type: String,
            enum: ['admin', 'professor', 'dean'],
            default: 'professor'
        },

        // Legacy department text kept for the current app.
        department: {
            type: String,
            trim: true,
            default: ''
        },

        // New structure allows one faculty to work across multiple departments.
        departmentIds: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Department'
            }
        ],
        employeeId: {
            type: String,
            trim: true,
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

// Before saving a user, we hash the password so it is never stored in plain text.
userSchema.pre('save', async function saveUserPassword(next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// This helper makes login password comparison easy inside controllers.
userSchema.methods.comparePassword = async function comparePassword(enteredPassword) {
    return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
