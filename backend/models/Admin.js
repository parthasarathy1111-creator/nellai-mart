'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ALL_ROLES, ROLES } = require('../constants/roles');

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Admin name is required.'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email.'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ALL_ROLES,
      default: ROLES.ADMIN,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Prevent returning passwordHash in JSON responses
adminSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

/**
 * Compare a plain-text password against the stored hash.
 * @param {string} plainPassword
 * @param {string} storedHash
 * @returns {Promise<boolean>}
 */
adminSchema.statics.comparePassword = async function (plainPassword, storedHash) {
  return bcrypt.compare(plainPassword, storedHash);
};

module.exports = mongoose.model('Admin', adminSchema);
