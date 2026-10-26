'use strict';

const authService = require('../services/auth.service');
const { sendSuccess } = require('../utils/response');

const HTTP_STATUS_OK = 200;

class AuthController {
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const ipAddress = req.ip || req.connection.remoteAddress;
      const userAgent = req.get('User-Agent') || '';

      const result = await authService.login({ email, password, ipAddress, userAgent });
      return sendSuccess(res, HTTP_STATUS_OK, 'Login successful.', result);
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      const profile = await authService.getProfile(req.user.id);
      return sendSuccess(res, 200, 'Profile retrieved successfully.', profile);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
