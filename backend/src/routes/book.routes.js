const express = require('express');
const { body, param } = require('express-validator');
const bookController = require('../controllers/book.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

// Validation rules
const bookValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('author')
    .trim()
    .notEmpty()
    .withMessage('Author is required')
    .isLength({ max: 100 })
    .withMessage('Author cannot exceed 100 characters'),
  body('publishedYear')
    .isInt({ min: 1450, max: new Date().getFullYear() })
    .withMessage(`Published year must be between 1450 and ${new Date().getFullYear()}`),
  body('status')
    .optional()
    .isIn(['available', 'borrowed'])
    .withMessage('Status must be available or borrowed')
];

// All book routes require authentication
router.use(authenticate);

// Routes accessible by all authenticated users
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.patch('/:id/borrow', bookController.borrowBook);
router.patch('/:id/return', bookController.returnBook);

// Admin only routes
router.post('/', authorize('admin'), bookValidation, bookController.createBook);
router.put('/:id', authorize('admin'), bookValidation, bookController.updateBook);
router.delete('/:id', authorize('admin'), bookController.deleteBook);

module.exports = router;