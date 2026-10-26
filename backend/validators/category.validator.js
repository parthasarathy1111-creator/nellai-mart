'use strict';

const { body } = require('express-validator');

const createCategoryValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required.')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters.'),

  body('icon')
    .optional()
    .trim()
    .isLength({ max: 10 }).withMessage('Icon should be a single emoji or short string.'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters.'),

  body('sortOrder')
    .optional()
    .isInt({ min: 0 }).withMessage('Sort order must be a non-negative integer.')
    .toInt(),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean.')
    .toBoolean(),
];

const updateCategoryValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Category name cannot be empty.')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters.'),

  body('icon')
    .optional()
    .trim()
    .isLength({ max: 10 }).withMessage('Icon should be a single emoji or short string.'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters.'),

  body('sortOrder')
    .optional()
    .isInt({ min: 0 }).withMessage('Sort order must be a non-negative integer.')
    .toInt(),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean.')
    .toBoolean(),
];

module.exports = { createCategoryValidator, updateCategoryValidator };
