'use strict';

const productRepository = require('../repositories/product.repository');
const shopRepository = require('../repositories/shop.repository');
const categoryRepository = require('../repositories/category.repository');
const activityLogRepository = require('../repositories/activityLog.repository');

const settingRepository = require('../repositories/setting.repository');
const { logActivity } = require('../utils/activityLogger');

class AdminService {
  async getSettings() {
    return settingRepository.getSettings();
  }

  async updateSettings(updateData, adminUser, ipAddress) {
    const settings = await settingRepository.updateSettings(updateData);

    logActivity({
      action: 'UPDATE_SYSTEM_SETTINGS',
      entity: 'Setting',
      entityId: settings._id,

      performedBy: adminUser?.id || adminUser?._id,
      details: {
        platformName: settings.platformName,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
      },
      ip: ipAddress,
    });

    return settings;
  }

  async getDashboardStats() {
    const [totalProducts, totalShops, totalCategories, activeShops, verifiedShops] = await Promise.all([
      productRepository.count(),
      shopRepository.count(),
      categoryRepository.count(),
      shopRepository.count({ status: 'ACTIVE' }),
      shopRepository.count({ isVerified: true }),
    ]);

    const recentLogs = await activityLogRepository.findAll({ page: 1, limit: 10 });

    return {
      totalProducts,
      totalShops,
      totalCategories,
      activeShops,
      verifiedShops,
      recentActivity: recentLogs.logs,
    };
  }

  async getActivityLogs({ page = 1, limit = 50, module, adminId }) {
    const filter = {};
    if (module) filter.module = module;
    if (adminId) filter.admin = adminId;

    return activityLogRepository.findAll({
      page: Number(page),
      limit: Number(limit),
      filter,
    });
  }

  async getReports() {
    const [productsByCategory, shopsByStatus] = await Promise.all([
      productRepository.findAll({ limit: 1000 }),
      shopRepository.findAll({ limit: 1000 }),
    ]);

    // Aggregate category distribution
    const categoryCountMap = {};
    productsByCategory.products.forEach((p) => {
      const catName = p.category?.name || 'Uncategorized';
      categoryCountMap[catName] = (categoryCountMap[catName] || 0) + 1;
    });

    const statusCountMap = {};
    shopsByStatus.shops.forEach((s) => {
      statusCountMap[s.status] = (statusCountMap[s.status] || 0) + 1;
    });

    return {
      totalProducts: productsByCategory.total,
      totalShops: shopsByStatus.total,
      productsByCategory: categoryCountMap,
      shopsByStatus: statusCountMap,
    };
  }
}

module.exports = new AdminService();
