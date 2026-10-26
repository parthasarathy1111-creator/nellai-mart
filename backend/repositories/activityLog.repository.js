'use strict';

const ActivityLog = require('../models/ActivityLog');

class ActivityLogRepository {
  async findAll({ page = 1, limit = 50, filter = {} }) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      ActivityLog.find(filter)
        .populate('admin', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ActivityLog.countDocuments(filter),
    ]);
    return { logs, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(data) {
    return ActivityLog.create(data);
  }
}

module.exports = new ActivityLogRepository();
