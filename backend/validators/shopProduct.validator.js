'use strict';

const { body } = require('express-validator');

const createShopProductValidator = [
  body('shop')
    .trim()
    .notEmpty().withMessage('Shop ID is required.')
    .isMongoId().withMessage('Shop ID must be a valid MongoDB ObjectId.'),

  body('product')
    .trim()
    .notEmpty().withMessage('Product ID is required.')
    .isMongoId().withMessage('Product ID must be a valid MongoDB ObjectId.'),

  body('price')
    .notEmpty().withMessage('Price is required.')
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number.')
    .toFloat(),

  body('mrp')
    .optional()
    .isFloat({ min: 0 }).withMessage('MRP must be a non-negative number.')
    .custom((mrp, { req }) => {
      if (req.body.price && mrp < req.body.price) {
        throw new Error('MRP cannot be less than selling price.');
      }
      return true;
    })
    .toFloat(),

  body('discountText')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Discount text cannot exceed 50 characters.'),

  body('stockStatus')
    .optional()
    .isIn(['IN_STOCK', 'OUT_OF_STOCK']).withMessage('Stock status must be IN_STOCK or OUT_OF_STOCK.'),

  body('isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable must be a boolean.')
    .toBoolean(),
];

const updateShopProductValidator = [
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number.')
    .toFloat(),

  body('mrp')
    .optional()
    .isFloat({ min: 0 }).withMessage('MRP must be a non-negative number.')
    .toFloat(),

  body('discountText')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Discount text cannot exceed 50 characters.'),

  body('stockStatus')
    .optional()
    .isIn(['IN_STOCK', 'OUT_OF_STOCK']).withMessage('Stock status must be IN_STOCK or OUT_OF_STOCK.'),

  body('isAvailable')
    .optional()
    .isBoolean().withMessage('isAvailable must be a boolean.')
    .toBoolean(),
];

module.exports = { createShopProductValidator, updateShopProductValidator };
