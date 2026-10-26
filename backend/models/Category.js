'use strict';

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required.'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters.'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    icon: {
      type: String,
      default: '🛒',
      maxlength: [10, 'Icon should be a single emoji or short string.'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters.'],
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    imagePublicId: {
      type: String,
      default: '',
      trim: true,
    },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: product count (populated via aggregation, not stored)
categorySchema.virtual('productCount').get(function () {
  return this._productCount || 0;
});

// Text index for search
categorySchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Category', categorySchema);
