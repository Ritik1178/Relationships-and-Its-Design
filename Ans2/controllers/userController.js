const User = require('../models/User');
const Book = require('../models/Book');

// Add a new user
exports.addUser = async (req, res) => {
    try {
        const { name, email } = req.body;
        const user = new User({ name, email });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get user rentals
exports.getUserRentals = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate('rentedBooks');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user.rentedBooks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Rent a book
exports.rentBook = async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        
        const user = await User.findById(userId);
        const book = await Book.findById(bookId);
        
        if (!user || !book) {
            return res.status(404).json({ message: 'User or Book not found' });
        }

        if (user.rentedBooks.includes(bookId)) {
            return res.status(400).json({ message: 'Book already rented by user' });
        }

        user.rentedBooks.push(bookId);
        book.rentedBy.push(userId);
        
        await user.save();
        await book.save();
        
        res.json({ message: 'Book rented successfully', user, book });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Return a book
exports.returnBook = async (req, res) => {
    try {
        const { userId, bookId } = req.body;
        
        const user = await User.findById(userId);
        const book = await Book.findById(bookId);
        
        if (!user || !book) {
            return res.status(404).json({ message: 'User or Book not found' });
        }

        if (!user.rentedBooks.includes(bookId)) {
            return res.status(400).json({ message: 'Book not rented by user' });
        }

        user.rentedBooks = user.rentedBooks.filter(id => id.toString() !== bookId);
        book.rentedBy = book.rentedBy.filter(id => id.toString() !== userId);
        
        await user.save();
        await book.save();
        
        res.json({ message: 'Book returned successfully', user, book });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 