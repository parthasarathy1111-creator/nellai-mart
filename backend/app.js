'use strict';

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const routes = require('./routes/index');
const errorHandler = require('./middleware/errorHandler');
const path = require('path');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

// ─── Security Headers ────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// ─── Static Uploads ──────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// ─── CORS ────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ─── Request Logging ─────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ─── Body Parsing ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Rate Limiting ────────────────────────────────────────────
app.use('/api', generalLimiter);

// ─── Health Check ─────────────────────────────────────────────
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Nellai Mart API is running',
    data: {
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    },
  });
});

// ─── API Routes ───────────────────────────────────────────────
app.use('/api/v1', routes);

// ─── 404 Handler ──────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    errors: [],
  });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use(errorHandler);

module.exports = app;
