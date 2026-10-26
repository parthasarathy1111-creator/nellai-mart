'use strict';

const { body } = require('express-validator');

const createProductValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Product name is required.')
    .isLength({ max: 200 }).withMessage('Name cannot exceed 200 characters.'),

  body('brand')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Brand cannot exceed 100 characters.'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters.'),

  body('unit')
    .trim()
    .notEmpty().withMessage('Unit is required (e.g. 1 kg, 500 ml).')
    .isLength({ max: 50 }).withMessage('Unit cannot exceed 50 characters.'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category ID is required.')
    .isMongoId().withMessage('Category must be a valid MongoDB ObjectId.'),

  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array.'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Each tag cannot exceed 50 characters.'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean.')
    .toBoolean(),
];

const updateProductValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Product name cannot be empty.')
    .isLength({ max: 200 }).withMessage('Name cannot exceed 200 characters.'),

  body('brand')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Brand cannot exceed 100 characters.'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters.'),

  body('unit')
    .optional()
    .trim()
    .notEmpty().withMessage('Unit cannot be empty.')
    .isLength({ max: 50 }).withMessage('Unit cannot exceed 50 characters.'),

  body('category')
    .optional()
    .trim()
    .isMongoId().withMessage('Category must be a valid MongoDB ObjectId.'),

  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array.'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Each tag cannot exceed 50 characters.'),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean.')
    .toBoolean(),
];

module.exports = { createProductValidator, updateProductValidator };
