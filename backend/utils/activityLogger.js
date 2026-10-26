'use strict';

const ActivityLog = require('../models/ActivityLog');

/**
 * Record an admin activity asynchronously.
 * Failures are logged but never thrown to avoid disrupting the main flow.
 *
 * @param {object} options
 * @param {string} options.action       - Human-readable action label
 * @param {string} options.entity       - Entity type (see ACTIVITY_ENTITIES)
 * @param {string|null} options.entityId
 * @param {string|null} options.performedBy - Admin _id
 * @param {object} [options.details]    - Additional metadata
 * @param {string} [options.ip]         - Request IP address
 */
async function logActivity({ action, entity, entityId = null, performedBy = null, details = {}, ip = null }) {
  try {
    await ActivityLog.create({
      action,
      entity: entity || 'Admin',
      entityId,
      performedBy,
      details,
      ip,
    });
  } catch (err) {
    console.warn('⚠️ ActivityLog write failed:', err.message);
  }
}

logActivity.logActivity = logActivity;

module.exports = logActivity;
