'use strict';

const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    platformName: {
      type: String,
      required: [true, 'Platform name is required.'],
      trim: true,
      maxlength: [100, 'Platform name cannot exceed 100 characters.'],
      default: 'Nellai Mart',
    },
    contactEmail: {
      type: String,
      required: [true, 'Official contact email is required.'],
      trim: true,
      lowercase: true,
      maxlength: [100, 'Contact email cannot exceed 100 characters.'],
      default: 'support@nellaimart.com',
    },
    contactPhone: {
      type: String,
      required: [true, 'Support phone number is required.'],
      trim: true,
      maxlength: [30, 'Phone number cannot exceed 30 characters.'],
      default: '+91 98421 12345',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Setting', settingSchema);
