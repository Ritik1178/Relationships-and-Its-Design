const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Add a new book
router.post('/add-book', bookController.addBook);

// Get book renters
router.get('/book-renters/:bookId', bookController.getBookRenters);

// Update book
router.put('/update-book/:bookId', bookController.updateBook);

// Delete book
router.delete('/delete-book/:bookId', bookController.deleteBook);

module.exports = router; 