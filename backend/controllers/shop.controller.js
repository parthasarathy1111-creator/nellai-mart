'use strict';

const shopService = require('../services/shop.service');
const { sendSuccess } = require('../utils/response');

class ShopController {
  async getAllShops(req, res, next) {
    try {
      const { page, limit, search, category, locality, status, isVerified, isFeatured, lat, lng, maxDistanceKm } = req.query;

      const parsedIsVerified = isVerified === 'true' ? true : isVerified === 'false' ? false : undefined;
      const parsedIsFeatured = isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined;

      const result = await shopService.getAllShops({
        page,
        limit,
        search,
        category,
        locality,
        status,
        isVerified: parsedIsVerified,
        isFeatured: parsedIsFeatured,
        lat,
        lng,
        maxDistanceKm,
      });

      return sendSuccess(res, 200, 'Shops retrieved successfully.', result.shops, {
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

  async getShopBySlug(req, res, next) {
    try {
      const shop = await shopService.getShopBySlug(req.params.slug);
      return sendSuccess(res, 200, 'Shop details retrieved successfully.', shop);
    } catch (error) {
      next(error);
    }
  }

  async getShopById(req, res, next) {
    try {
      const shop = await shopService.getShopById(req.params.id);
      return sendSuccess(res, 200, 'Shop retrieved successfully.', shop);
    } catch (error) {
      next(error);
    }
  }

  async createShop(req, res, next) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const shop = await shopService.createShop(req.body, req.files, req.user, ipAddress);
      return sendSuccess(res, 201, 'Shop created successfully.', shop);
    } catch (error) {
      next(error);
    }
  }

  async updateShop(req, res, next) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const shop = await shopService.updateShop(req.params.id, req.body, req.files, req.user, ipAddress);
      return sendSuccess(res, 200, 'Shop updated successfully.', shop);
    } catch (error) {
      next(error);
    }
  }

  async deleteShop(req, res, next) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const result = await shopService.deleteShop(req.params.id, req.user, ipAddress);
      return sendSuccess(res, 200, result.message);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ShopController();
