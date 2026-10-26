'use strict';

const Admin = require('../models/Admin');

class AdminRepository {
  async findByEmail(email) {
    return Admin.findOne({ email: email.toLowerCase() }).select('+password');
  }

  async findById(id) {
    return Admin.findById(id);
  }

  async create(adminData) {
    return Admin.create(adminData);
  }

  async updateLastLogin(id) {
    return Admin.findByIdAndUpdate(id, { lastLoginAt: new Date() }, { new: true });
  }

  async updateProfile(id, updateData) {
    return Admin.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  }
}

module.exports = new AdminRepository();
