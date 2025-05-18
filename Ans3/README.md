# Library Management System

A Node.js application for managing a library system with books and members.

## Features

- Add and manage books
- Add and manage members
- Borrow and return books
- Track borrowed books for members
- Track borrowers for books
- Update book details
- Delete books

## Prerequisites

- Node.js
- MongoDB

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Running the Application

1. Start MongoDB service
2. Run the application:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

1. Add Book
   - POST /add-book
   - Body: { "title": "string", "author": "string" }

2. Add Member
   - POST /add-member
   - Body: { "name": "string", "email": "string" }

3. Borrow Book
   - POST /borrow-book
   - Body: { "bookId": "string", "memberId": "string" }

4. Return Book
   - POST /return-book
   - Body: { "bookId": "string", "memberId": "string" }

5. Get Member's Borrowed Books
   - GET /member-borrowed-books/:memberId

6. Get Book's Borrowers
   - GET /book-borrowers/:bookId

7. Update Book
   - PUT /update-book/:bookId
   - Body: { "title": "string", "author": "string" }

8. Delete Book
   - DELETE /delete-book/:bookId

## Data Validation

- Book title and member name must be at least 3 characters long
- Member email must be unique and in valid format
- Book status can only be 'available' or 'borrowed' 