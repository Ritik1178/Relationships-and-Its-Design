const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3
    },
    author: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'borrowed'],
        required: true,
        default: 'available'
    },
    borrowers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-hook to check book availability before borrowing
bookSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'borrowed') {
        if (this.borrowers.length === 0) {
            const error = new Error('Cannot mark book as borrowed without a borrower');
            return next(error);
        }
    }
    next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book; 