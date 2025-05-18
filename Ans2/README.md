# Book Rental System

A RESTful API for managing a book rental system using Node.js, Express, and MongoDB.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running on your system

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### User Endpoints

1. Add User
- POST `/api/add-user`
- Body: `{ "name": "Jane Doe", "email": "jane@example.com" }`

2. Get User Rentals
- GET `/api/user-rentals/:userId`
- Returns all books rented by the user

3. Rent Book
- POST `/api/rent-book`
- Body: `{ "userId": "user_id", "bookId": "book_id" }`

4. Return Book
- POST `/api/return-book`
- Body: `{ "userId": "user_id", "bookId": "book_id" }`

### Book Endpoints

1. Add Book
- POST `/api/add-book`
- Body: `{ "title": "1984", "author": "George Orwell", "genre": "Dystopian" }`

2. Get Book Renters
- GET `/api/book-renters/:bookId`
- Returns all users who have rented the book

3. Update Book
- PUT `/api/update-book/:bookId`
- Body: `{ "title": "New Title", "author": "New Author", "genre": "New Genre" }`

4. Delete Book
- DELETE `/api/delete-book/:bookId`

## Data Models

### User Schema
- name: String (required, min length 3)
- email: String (required, unique)
- rentedBooks: Array of Book references

### Book Schema
- title: String (required, min length 3)
- author: String (required)
- genre: String (optional)
- rentedBy: Array of User references 