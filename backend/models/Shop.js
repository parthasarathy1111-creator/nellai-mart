'use strict';

const mongoose = require('mongoose');
const { SHOP_STATUS, SHOP_STATUS_VALUES } = require('../constants/status');

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Shop name is required.'],
      trim: true,
      maxlength: [200, 'Shop name cannot exceed 200 characters.'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    ownerName: {
      type: String,
      required: [true, 'Owner name is required.'],
      trim: true,
      maxlength: [100, 'Owner name cannot exceed 100 characters.'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required.'],
      trim: true,
      match: [/^\+?[\d\s\-()]{7,20}$/, 'Please provide a valid phone number.'],
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email.'],
      default: '',
    },
    address: {
      type: String,
      required: [true, 'Address is required.'],
      trim: true,
      maxlength: [300, 'Address cannot exceed 300 characters.'],
    },
    locality: {
      type: String,
      required: [true, 'Locality is required.'],
      trim: true,
      index: true,
    },
    city: {
      type: String,
      default: 'Tirunelveli',
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Shop category is required.'],
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    timing: {
      type: String,
      trim: true,
      default: '',
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    status: {
      type: String,
      enum: SHOP_STATUS_VALUES,
      default: SHOP_STATUS.PENDING,
      index: true,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true },
      },
    ],
    geoLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [77.7567, 8.7139], // Tirunelveli default
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Geo-spatial index for proximity queries (v2 readiness)
shopSchema.index({ geoLocation: '2dsphere' });

// Text index for search
shopSchema.index(
  { name: 'text', ownerName: 'text', locality: 'text', category: 'text' },
  { weights: { name: 10, locality: 5, category: 3, ownerName: 1 }, name: 'shop_text_idx' }
);

module.exports = mongoose.model('Shop', shopSchema);
