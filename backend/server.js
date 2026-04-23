const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const bookRoutes = require('./src/routes/book.routes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// MongoDB connection - FIXED (removed deprecated options)
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('✅ MongoDB connected successfully');
  console.log('📚 Database:', mongoose.connection.db.databaseName);
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  process.exit(1);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 API URL: http://localhost:${PORT}/api`);
});