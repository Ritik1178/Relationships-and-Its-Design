const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Add a new user
router.post('/add-user', userController.addUser);

// Get user rentals
router.get('/user-rentals/:userId', userController.getUserRentals);

// Rent a book
router.post('/rent-book', userController.rentBook);

// Return a book
router.post('/return-book', userController.returnBook);

module.exports = router; 