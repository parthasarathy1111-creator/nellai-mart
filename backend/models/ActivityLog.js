'use strict';

const mongoose = require('mongoose');
const { ACTIVITY_ENTITY_VALUES } = require('../constants/status');

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: [true, 'Action is required.'],
      trim: true,
      maxlength: [200, 'Action cannot exceed 200 characters.'],
    },
    entity: {
      type: String,
      required: [true, 'Entity is required.'],
      enum: ACTIVITY_ENTITY_VALUES,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ip: {
      type: String,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // TTL index: auto-delete logs after 90 days
      expires: 60 * 60 * 24 * 90,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

activityLogSchema.index({ entity: 1, createdAt: -1 });
activityLogSchema.index({ performedBy: 1, createdAt: -1 });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
