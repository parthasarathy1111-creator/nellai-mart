'use strict';

const { body } = require('express-validator');
const { SHOP_STATUS_VALUES } = require('../constants/status');

const createShopValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Shop name is required.')
    .isLength({ max: 200 }).withMessage('Shop name cannot exceed 200 characters.'),

  body('ownerName')
    .trim()
    .notEmpty().withMessage('Owner name is required.')
    .isLength({ max: 100 }).withMessage('Owner name cannot exceed 100 characters.'),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required.')
    .matches(/^\+?[\d\s\-()]{7,20}$/).withMessage('Please provide a valid phone number.'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('address')
    .trim()
    .notEmpty().withMessage('Address is required.')
    .isLength({ max: 300 }).withMessage('Address cannot exceed 300 characters.'),

  body('locality')
    .trim()
    .notEmpty().withMessage('Locality is required.')
    .isLength({ max: 100 }).withMessage('Locality cannot exceed 100 characters.'),

  body('city')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('City cannot exceed 100 characters.'),

  body('category')
    .trim()
    .notEmpty().withMessage('Shop category is required.'),

  body('timing')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Timing cannot exceed 100 characters.'),

  body('isOpen')
    .optional()
    .isBoolean().withMessage('isOpen must be a boolean.')
    .toBoolean(),

  body('geoLocation.coordinates')
    .optional()
    .isArray({ min: 2, max: 2 }).withMessage('Coordinates must be [longitude, latitude].')
    .custom((coords) => {
      const [lng, lat] = coords;
      if (lng < -180 || lng > 180) throw new Error('Longitude must be between -180 and 180.');
      if (lat < -90 || lat > 90) throw new Error('Latitude must be between -90 and 90.');
      return true;
    }),
];

const updateShopValidator = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Shop name cannot be empty.')
    .isLength({ max: 200 }).withMessage('Shop name cannot exceed 200 characters.'),

  body('ownerName')
    .optional()
    .trim()
    .notEmpty().withMessage('Owner name cannot be empty.')
    .isLength({ max: 100 }).withMessage('Owner name cannot exceed 100 characters.'),

  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[\d\s\-()]{7,20}$/).withMessage('Please provide a valid phone number.'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),

  body('address')
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage('Address cannot exceed 300 characters.'),

  body('locality')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Locality cannot exceed 100 characters.'),

  body('status')
    .optional()
    .trim()
    .isIn(SHOP_STATUS_VALUES).withMessage(`Status must be one of: ${SHOP_STATUS_VALUES.join(', ')}`),

  body('isOpen')
    .optional()
    .isBoolean().withMessage('isOpen must be a boolean.')
    .toBoolean(),

  body('isVerified')
    .optional()
    .isBoolean().withMessage('isVerified must be a boolean.')
    .toBoolean(),

  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean.')
    .toBoolean(),
];

module.exports = { createShopValidator, updateShopValidator };
