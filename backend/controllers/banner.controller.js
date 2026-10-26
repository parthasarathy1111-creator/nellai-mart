'use strict';

const bannerService = require('../services/banner.service');
const { sendSuccess } = require('../utils/response');

class BannerController {
  async getBanners(req, res, next) {
    try {
      const activeOnly = req.query.activeOnly !== 'false';
      const banners = await bannerService.getBanners({ activeOnly });
      return sendSuccess(res, 200, 'Banners retrieved successfully.', banners);
    } catch (error) {
      next(error);
    }
  }

  async createBanner(req, res, next) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const banner = await bannerService.createBanner(req.body, req.file, req.user, ipAddress);
      return sendSuccess(res, 201, 'Banner created successfully.', banner);
    } catch (error) {
      next(error);
    }
  }

  async updateBanner(req, res, next) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const banner = await bannerService.updateBanner(req.params.id, req.body, req.file, req.user, ipAddress);
      return sendSuccess(res, 200, 'Banner updated successfully.', banner);
    } catch (error) {
      next(error);
    }
  }

  async deleteBanner(req, res, next) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const result = await bannerService.deleteBanner(req.params.id, req.user, ipAddress);
      return sendSuccess(res, 200, result.message);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BannerController();
