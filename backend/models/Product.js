'use strict';

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required.'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters.'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    brand: {
      type: String,
      trim: true,
      maxlength: [100, 'Brand cannot exceed 100 characters.'],
      default: '',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters.'],
      default: '',
    },
    unit: {
      type: String,
      required: [true, 'Unit is required (e.g. 1 kg, 500 ml, Pack of 10).'],
      trim: true,
      maxlength: [50, 'Unit cannot exceed 50 characters.'],
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: '' },
      },
    ],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required.'],
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        maxlength: 50,
      },
    ],
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

// Full-text search index
productSchema.index(
  { name: 'text', brand: 'text', description: 'text', tags: 'text' },
  { weights: { name: 10, brand: 5, tags: 3, description: 1 }, name: 'product_text_idx' }
);

// Virtual: shop count (populated via aggregation)
productSchema.virtual('shopCount').get(function () {
  return this._shopCount || 0;
});

module.exports = mongoose.model('Product', productSchema);
