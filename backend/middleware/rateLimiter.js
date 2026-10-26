'use strict';

const rateLimit = require('express-rate-limit');

const WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000; // 15 minutes
const MAX_GENERAL = parseInt(process.env.RATE_LIMIT_MAX, 10) || 100;
const MAX_AUTH = parseInt(process.env.AUTH_RATE_LIMIT_MAX, 10) || 10;

/**
 * General API rate limiter — 100 requests per 15 minutes.
 */
const generalLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_GENERAL,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.',
    errors: [],
  },
});

/**
 * Strict auth rate limiter — 10 requests per 15 minutes.
 * Applied only to auth endpoints to prevent brute-force attacks.
 */
const authLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_AUTH,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again in 15 minutes.',
    errors: [],
  },
});

module.exports = { generalLimiter, authLimiter };
