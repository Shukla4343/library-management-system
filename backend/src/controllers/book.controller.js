const Book = require('../models/Book');
const { validationResult } = require('express-validator');

// Get all books with filters and pagination
exports.getAllBooks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { title, author, status, search } = req.query;

    // Build filter object
    let filter = {};
    
    if (title) {
      filter.title = { $regex: title, $options: 'i' };
    }
    if (author) {
      filter.author = { $regex: author, $options: 'i' };
    }
    if (status) {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    const books = await Book.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('borrowedBy', 'username');

    const total = await Book.countDocuments(filter);

    res.json({
      success: true,
      data: {
        books,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single book by ID
exports.getBookById = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).populate('borrowedBy', 'username');
    
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    res.json({
      success: true,
      data: { book }
    });
  } catch (error) {
    next(error);
  }
};

// Create new book (Admin only)
exports.createBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { title, author, publishedYear, status } = req.body;
    
    const book = new Book({
      title,
      author,
      publishedYear,
      status: status || 'available'
    });
    
    await book.save();
    
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: { book }
    });
  } catch (error) {
    next(error);
  }
};

// Update book (Admin only)
exports.updateBook = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { title, author, publishedYear, status } = req.body;
    
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    // Update fields
    if (title) book.title = title;
    if (author) book.author = author;
    if (publishedYear) book.publishedYear = publishedYear;
    if (status) book.status = status;
    
    await book.save();
    
    res.json({
      success: true,
      message: 'Book updated successfully',
      data: { book }
    });
  } catch (error) {
    next(error);
  }
};

// Delete book (Admin only)
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    await book.deleteOne();
    
    res.json({
      success: true,
      message: 'Book deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Borrow a book
exports.borrowBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    if (book.status === 'borrowed') {
      return res.status(400).json({
        success: false,
        message: 'Book is already borrowed'
      });
    }
    
    book.status = 'borrowed';
    book.borrowedBy = req.user.userId;
    book.borrowedAt = new Date();
    
    await book.save();
    
    // Log the action (for audit)
    console.log(`User ${req.user.username} borrowed book: ${book.title}`);
    
    res.json({
      success: true,
      message: 'Book borrowed successfully',
      data: { book }
    });
  } catch (error) {
    next(error);
  }
};

// Return a book
exports.returnBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found'
      });
    }
    
    if (book.status === 'available') {
      return res.status(400).json({
        success: false,
        message: 'Book is already available'
      });
    }
    
    // Check if the current user borrowed this book (optional)
    if (book.borrowedBy && book.borrowedBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only return books you borrowed'
      });
    }
    
    book.status = 'available';
    book.borrowedBy = null;
    book.borrowedAt = null;
    
    await book.save();
    
    res.json({
      success: true,
      message: 'Book returned successfully',
      data: { book }
    });
  } catch (error) {
    next(error);
  }
};