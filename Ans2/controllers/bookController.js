const Book = require('../models/Book');
const User = require('../models/User');

// Add a new book
exports.addBook = async (req, res) => {
    try {
        const { title, author, genre } = req.body;
        const book = new Book({ title, author, genre });
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get book renters
exports.getBookRenters = async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId)
            .populate('rentedBy');
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book.rentedBy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update book
exports.updateBook = async (req, res) => {
    try {
        const { title, author, genre } = req.body;
        const book = await Book.findByIdAndUpdate(
            req.params.bookId,
            { title, author, genre },
            { new: true, runValidators: true }
        );
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete book
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Remove book from all users' rentedBooks arrays
        await User.updateMany(
            { rentedBooks: req.params.bookId },
            { $pull: { rentedBooks: req.params.bookId } }
        );

        await book.remove();
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 