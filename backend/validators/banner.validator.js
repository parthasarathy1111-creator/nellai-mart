'use strict';

const { body } = require('express-validator');

const createBannerValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Banner title is required.')
    .isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters.'),

  body('subtitle')
    .optional()
    .trim()
    .isLength({ max: 250 }).withMessage('Subtitle cannot exceed 250 characters.'),

  body('linkUrl')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Link URL cannot exceed 500 characters.'),

  body('sortOrder')
    .optional()
    .isInt({ min: 0 }).withMessage('Sort order must be a non-negative integer.')
    .toInt(),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean.')
    .toBoolean(),
];

const updateBannerValidator = [
  body('title')
    .optional()
    .trim()
    .notEmpty().withMessage('Title cannot be empty.')
    .isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters.'),

  body('subtitle')
    .optional()
    .trim()
    .isLength({ max: 250 }).withMessage('Subtitle cannot exceed 250 characters.'),

  body('linkUrl')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Link URL cannot exceed 500 characters.'),

  body('sortOrder')
    .optional()
    .isInt({ min: 0 }).withMessage('Sort order must be a non-negative integer.')
    .toInt(),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean.')
    .toBoolean(),
];

module.exports = { createBannerValidator, updateBannerValidator };
