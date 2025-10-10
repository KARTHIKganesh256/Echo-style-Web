import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import analysisRoutes from './routes/analysisRoutes.js';
import productRoutes from './routes/productRoutes.js';
import skinCareRoutes from './routes/skinCareRoutes.js';

dotenv.config();

const app = express();

// Connect to MongoDB (async, non-blocking)
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/analyze-tone', analysisRoutes);
app.use('/api/products', productRoutes);
app.use('/api/skin-care', skinCareRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Echo Style Assistant API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('🚀 =====================================');
  console.log(`✅ Echo Style Assistant Server Running`);
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('=====================================');
  console.log('');
});
