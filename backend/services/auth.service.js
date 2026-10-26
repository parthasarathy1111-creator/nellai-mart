'use strict';

const adminRepository = require('../repositories/admin.repository');
const { generateToken } = require('../config/jwt');
const logActivity = require('../utils/activityLogger');
const { HTTP_STATUS } = require('../constants/messages');

class AuthService {
  async login({ email, password, ipAddress, userAgent }) {
    const admin = await adminRepository.findByEmail(email);
    if (!admin) {
      const error = new Error('Invalid email or password.');
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      throw error;
    }

    if (!admin.isActive) {
      const error = new Error('Account has been deactivated. Contact Super Admin.');
      error.statusCode = HTTP_STATUS.FORBIDDEN;
      throw error;
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = HTTP_STATUS.UNAUTHORIZED;
      throw error;
    }

    await adminRepository.updateLastLogin(admin._id);

    const token = generateToken({
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    });

    logActivity({
      adminId: admin._id,
      action: 'ADMIN_LOGIN',
      module: 'AUTH',
      description: `Admin ${admin.name} (${admin.email}) logged in successfully`,
      ipAddress,
      userAgent,
    });

    return {
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatar,
        lastLoginAt: admin.lastLoginAt,
      },
    };
  }

  async getProfile(adminId) {
    const admin = await adminRepository.findById(adminId);
    if (!admin) {
      const error = new Error('Admin profile not found.');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    return {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      avatar: admin.avatar,
      createdAt: admin.createdAt,
      lastLoginAt: admin.lastLoginAt,
    };
  }
}

module.exports = new AuthService();
