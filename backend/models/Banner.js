'use strict';

const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Banner title is required.'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters.'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required.'],
    },
    imagePublicId: {
      type: String,
      required: [true, 'Image public ID is required for Cloudinary management.'],
    },
    linkUrl: {
      type: String,
      trim: true,
      default: null,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
