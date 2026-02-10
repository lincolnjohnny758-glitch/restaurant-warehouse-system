// نظام إدارة المخازن - Server Entry Point
// Restaurant Warehouse Management System - Main Server

const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { initDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// Middleware Setup
// ========================================

// Security
app.use(helmet());

// CORS - Allow LAN access
app.use(cors({
  origin: '*', // For LAN access
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files - serve frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ========================================
// Routes
// ========================================

const authRoutes = require('./routes/auth');
const requestRoutes = require('./routes/requests');
const itemRoutes = require('./routes/items');
const categoryRoutes = require('./routes/categories');
const userRoutes = require('./routes/users');
const reportRoutes = require('./routes/reports');
const notificationRoutes = require('./routes/notifications');

app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'نظام إدارة المخازن يعمل بنجاح',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Serve frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

// ========================================
// Error Handling
// ========================================

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'خطأ في الخادم',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// ========================================
// Server Startup
// ========================================

const startServer = async () => {
  try {
    // Initialize database
    await initDatabase();
    console.log('✅ Database initialized successfully');

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log('='.repeat(50));
      console.log('🚀 نظام إدارة المخازن');
      console.log('Restaurant Warehouse Management System');
      console.log('='.repeat(50));
      console.log(`📡 Server running on: http://0.0.0.0:${PORT}`);
      console.log(`🌐 LAN Access: http://[YOUR-IP]:${PORT}`);
      console.log(`📊 API Docs: http://0.0.0.0:${PORT}/api/health`);
      console.log(`⏰ Started at: ${new Date().toLocaleString('ar-YE')}`);
      console.log('='.repeat(50));
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

startServer();

module.exports = app;
