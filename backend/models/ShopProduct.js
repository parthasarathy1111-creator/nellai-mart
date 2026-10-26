'use strict';

const mongoose = require('mongoose');

const shopProductSchema = new mongoose.Schema(
  {
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Shop',
      required: [true, 'Shop reference is required.'],
      index: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required.'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required.'],
      min: [0, 'Price cannot be negative.'],
    },
    mrp: {
      type: Number,
      required: [true, 'MRP is required.'],
      min: [0, 'MRP cannot be negative.'],
    },
    inStock: {
      type: Boolean,
      default: true,
      index: true,
    },
    stockQty: {
      type: Number,
      default: 0,
      min: [0, 'Stock quantity cannot be negative.'],
    },
    // Allows per-shop unit override (e.g. "Loose 500g" vs default "1 kg bag")
    unitOverride: {
      type: String,
      trim: true,
      maxlength: [50, 'Unit override cannot exceed 50 characters.'],
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Ensure a product appears only once per shop
shopProductSchema.index({ shop: 1, product: 1 }, { unique: true });

// Virtual: discount percentage
shopProductSchema.virtual('discountPercent').get(function () {
  if (!this.mrp || this.mrp <= 0) return 0;
  const discount = ((this.mrp - this.price) / this.mrp) * 100;
  return Math.max(0, Math.round(discount));
});

module.exports = mongoose.model('ShopProduct', shopProductSchema);
