const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    borrowedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }]
});

// Pre-hook to validate email format
memberSchema.pre('save', function(next) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
        const error = new Error('Invalid email format');
        return next(error);
    }
    next();
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member; 