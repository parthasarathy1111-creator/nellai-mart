'use strict';

const { body } = require('express-validator');

// Regex for Indian and international phone numbers used in Nellai Mart (allows +91, spaces, dashes)
const indianPhoneRegex = /^(\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$|^(\+91[\s-]?)?[6-9]\d{9}$/;

const updateSettingsValidator = [
  body('platformName')
    .trim()
    .notEmpty()
    .withMessage('Platform Name cannot be empty.')
    .isLength({ max: 100 })
    .withMessage('Platform Name cannot exceed 100 characters.'),

  body('contactEmail')
    .trim()
    .notEmpty()
    .withMessage('Official Contact Email is required.')
    .isEmail()
    .withMessage('Please provide a valid official contact email address.')
    .normalizeEmail(),

  body('contactPhone')
    .trim()
    .notEmpty()
    .withMessage('Support Phone Number is required.')
    .custom((val) => {
      // Clean standard characters: spaces, hyphens, parentheses
      const cleaned = val.replace(/[\s\-()]/g, '');
      const valid = /^(\+91)?[6-9]\d{9}$/.test(cleaned);
      if (!valid) {
        throw new Error('Please enter a valid 10-digit Indian support phone number (e.g. +91 98421 12345).');
      }
      return true;
    }),
];

module.exports = { updateSettingsValidator };
