const express = require('express');
const mongoose = require('mongoose');
const Book = require('./models/Book');
const Member = require('./models/Member');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/library', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Add Book
app.post('/add-book', async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add Member
app.post('/add-member', async (req, res) => {
    try {
        const member = new Member(req.body);
        await member.save();
        res.status(201).json(member);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Borrow Book
app.post('/borrow-book', async (req, res) => {
    try {
        const { bookId, memberId } = req.body;
        
        const book = await Book.findById(bookId);
        const member = await Member.findById(memberId);

        if (!book || !member) {
            return res.status(404).json({ error: 'Book or Member not found' });
        }

        if (book.status === 'borrowed') {
            return res.status(400).json({ error: 'Book is already borrowed' });
        }

        book.status = 'borrowed';
        book.borrowers.push(memberId);
        member.borrowedBooks.push(bookId);

        await book.save();
        await member.save();

        res.json({ message: 'Book borrowed successfully', book, member });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Return Book
app.post('/return-book', async (req, res) => {
    try {
        const { bookId, memberId } = req.body;
        
        const book = await Book.findById(bookId);
        const member = await Member.findById(memberId);

        if (!book || !member) {
            return res.status(404).json({ error: 'Book or Member not found' });
        }

        book.status = 'available';
        book.borrowers = book.borrowers.filter(id => id.toString() !== memberId);
        member.borrowedBooks = member.borrowedBooks.filter(id => id.toString() !== bookId);

        await book.save();
        await member.save();

        res.json({ message: 'Book returned successfully', book, member });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get Member Borrowed Books
app.get('/member-borrowed-books/:memberId', async (req, res) => {
    try {
        const member = await Member.findById(req.params.memberId)
            .populate('borrowedBooks');
        if (!member) {
            return res.status(404).json({ error: 'Member not found' });
        }
        res.json(member.borrowedBooks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get Book Borrowers
app.get('/book-borrowers/:bookId', async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId)
            .populate('borrowers');
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book.borrowers);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update Book Details
app.put('/update-book/:bookId', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.bookId,
            req.body,
            { new: true, runValidators: true }
        );
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete Book
app.delete('/delete-book/:bookId', async (req, res) => {
    try {
        const book = await Book.findById(req.params.bookId);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // Remove book from all members' borrowedBooks
        await Member.updateMany(
            { borrowedBooks: book._id },
            { $pull: { borrowedBooks: book._id } }
        );

        await book.remove();
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 