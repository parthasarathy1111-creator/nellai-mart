'use strict';

const adminService = require('../services/admin.service');
const { sendSuccess } = require('../utils/response');

class AdminController {
  async getDashboardStats(req, res, next) {
    try {
      const stats = await adminService.getDashboardStats();
      return sendSuccess(res, 200, 'Dashboard statistics retrieved successfully.', stats);
    } catch (error) {
      next(error);
    }
  }

  async getActivityLogs(req, res, next) {
    try {
      const { page, limit, module, adminId } = req.query;
      const result = await adminService.getActivityLogs({ page, limit, module, adminId });
      return sendSuccess(res, 200, 'Activity logs retrieved successfully.', result.logs, {
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getReports(req, res, next) {
    try {
      const reports = await adminService.getReports();
      return sendSuccess(res, 200, 'Reports generated successfully.', reports);
    } catch (error) {
      next(error);
    }
  }

  async getSettings(req, res, next) {
    try {
      const settings = await adminService.getSettings();
      return sendSuccess(res, 200, 'System settings retrieved successfully.', settings);
    } catch (error) {
      next(error);
    }
  }

  async updateSettings(req, res, next) {
    try {
      const ipAddress = req.ip || req.connection?.remoteAddress;
      const { platformName, contactEmail, contactPhone } = req.body;
      const settings = await adminService.updateSettings(
        { platformName, contactEmail, contactPhone },
        req.user,
        ipAddress
      );
      return sendSuccess(res, 200, 'System settings updated successfully.', settings);
    } catch (error) {
      next(error);
    }
  }
}


module.exports = new AdminController();
