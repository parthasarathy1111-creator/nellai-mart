'use strict';

const Setting = require('../models/Setting');

class SettingRepository {
  async getSettings() {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({
        platformName: 'Nellai Mart',
        contactEmail: 'support@nellaimart.com',
        contactPhone: '+91 98421 12345',
      });
    }
    return settings;
  }

  async updateSettings(updateData) {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(updateData);
    } else {
      settings.platformName = updateData.platformName ?? settings.platformName;
      settings.contactEmail = updateData.contactEmail ?? settings.contactEmail;
      settings.contactPhone = updateData.contactPhone ?? settings.contactPhone;
      await settings.save();
    }
    return settings;
  }
}

module.exports = new SettingRepository();
