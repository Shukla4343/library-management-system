const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    minlength: [1, 'Author name cannot be empty'],
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  status: {
    type: String,
    enum: ['available', 'borrowed'],
    default: 'available'
  },
  publishedYear: {
    type: Number,
    required: [true, 'Published year is required'],
    min: [1450, 'Published year must be after 1450'],
    max: [new Date().getFullYear(), 'Published year cannot be in the future']
  },
  borrowedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  borrowedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search functionality
bookSchema.index({ title: 'text', author: 'text' });

// Update timestamp on update
bookSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Book', bookSchema);