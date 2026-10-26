'use strict';

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { loginValidator } = require('../validators/auth.validator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/login', authLimiter, loginValidator, validate, authController.login);
router.get('/profile', authenticate, authController.getProfile);

module.exports = router;
