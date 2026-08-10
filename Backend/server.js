const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ===== ROUTES =====

// 1. Auth Routes (Login, Register, Reset Password)
try {
  const authRoutes = require('./routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ Auth routes loaded');
} catch (err) {
  console.log('❌ Auth routes not found');
  console.log('   Error:', err.message);
  app.get('/api/auth/test', (req, res) => {
    res.json({ message: 'Auth API - Create routes/auth.js file' });
  });
}

// 2. Projects Routes
try {
  const projectRoutes = require('./routes/projects');
  app.use('/api/projects', projectRoutes);
  console.log('✅ Projects routes loaded');
} catch (err) {
  console.log('❌ Projects routes not found');
  console.log('   Error:', err.message);
  app.get('/api/projects', (req, res) => {
    res.json({ message: 'Projects API - Create routes/projects.js file' });
  });
}

// 3. Bookings Routes
try {
  const bookingRoutes = require('./routes/bookings');
  app.use('/api/bookings', bookingRoutes);
  console.log('✅ Bookings routes loaded');
} catch (err) {
  console.log('❌ Bookings routes not found');
  console.log('   Error:', err.message);
  app.get('/api/bookings', (req, res) => {
    res.json({ message: 'Bookings API - Create routes/bookings.js file' });
  });
}

// 🟢 4. Crew Routes - මෙය 404 handler එකට කලින් දාන්න
try {
  const crewRoutes = require('./routes/crew');
  app.use('/api/crew', crewRoutes);
  console.log('✅ Crew routes loaded');
} catch (err) {
  console.log('❌ Crew routes not found');
  console.log('   Error:', err.message);
  app.get('/api/crew', (req, res) => {
    res.json({ message: 'Crew API - Create routes/crew.js file' });
  });
}

// ===== TEST ROUTE =====
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true,
    message: '✅ API is working!',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        resetPassword: 'POST /api/auth/reset-password',
        profile: 'GET /api/auth/me',
        users: 'GET /api/auth/users',
        checkEmail: 'GET /api/auth/check-email?email=test@example.com',
        checkUsername: 'GET /api/auth/check-username?username=test'
      },
      projects: {
        getAll: 'GET /api/projects',
        create: 'POST /api/projects',
        getOne: 'GET /api/projects/:id',
        update: 'PUT /api/projects/:id',
        delete: 'DELETE /api/projects/:id'
      },
      bookings: {
        getAll: 'GET /api/bookings',
        create: 'POST /api/bookings',
        getOne: 'GET /api/bookings/:id',
        update: 'PUT /api/bookings/:id',
        delete: 'DELETE /api/bookings/:id'
      },
      crew: {  // 🟢 මෙය add කරන්න
        getAll: 'GET /api/crew',
        create: 'POST /api/crew',
        getOne: 'GET /api/crew/:id',
        update: 'PUT /api/crew/:id',
        delete: 'DELETE /api/crew/:id'
      },
      test: 'GET /api/test'
    },
    timestamp: new Date().toISOString()
  });
});

// ===== MONGO DB =====
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Flames';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully');
  console.log(`   Database: ${mongoose.connection.name}`);
  console.log(`   Host: ${mongoose.connection.host}`);
})
.catch((err) => {
  console.log('❌ MongoDB Connection Failed');
  console.log('   Error:', err.message);
  console.log('   Please make sure MongoDB is running');
  console.log('   Try: mongod');
});

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: {
      auth: '/api/auth',
      projects: '/api/projects',
      bookings: '/api/bookings',
      crew: '/api/crew',  // 🟢 මෙය add කරන්න
      test: '/api/test'
    }
  });
});

// ===== Global Error Handler =====
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error('Stack:', err.stack);
  }
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      field: field
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log('\n🚀 ============================================');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('🚀 ============================================');
  console.log(`📡 Test:        http://localhost:${PORT}/api/test`);
  console.log(`🔑 Auth:        http://localhost:${PORT}/api/auth`);
  console.log(`📁 Projects:    http://localhost:${PORT}/api/projects`);
  console.log(`📅 Bookings:    http://localhost:${PORT}/api/bookings`);
  console.log(`👥 Crew:        http://localhost:${PORT}/api/crew`); // 🟢 මෙය add කරන්න
  console.log('🚀 ============================================');
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔄 Press Ctrl+C to stop\n`);
});