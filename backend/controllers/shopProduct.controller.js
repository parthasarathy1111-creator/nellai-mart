'use strict';

const shopProductService = require('../services/shopProduct.service');
const { sendSuccess } = require('../utils/response');

class ShopProductController {
  async getShopProducts(req, res, next) {
    try {
      const { shopId } = req.params;
      const { page, limit } = req.query;
      const result = await shopProductService.getShopProducts(shopId, { page, limit });
      return sendSuccess(res, 200, 'Shop inventory retrieved successfully.', result.shopProducts, {
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

  async getProductShops(req, res, next) {
    try {
      const { productId } = req.params;
      const { page, limit } = req.query;
      const result = await shopProductService.getProductShops(productId, { page, limit });
      return sendSuccess(res, 200, 'Shops offering product retrieved successfully.', result.shopProducts, {
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

  async addOrUpdateProductInShop(req, res, next) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const shopProduct = await shopProductService.addOrUpdateProductInShop(req.body, req.user, ipAddress);
      return sendSuccess(res, 200, 'Shop product pricing and stock saved successfully.', shopProduct);
    } catch (error) {
      next(error);
    }
  }

  async removeProductFromShop(req, res, next) {
    try {
      const { shopId, productId } = req.params;
      const ipAddress = req.ip || req.connection.remoteAddress;
      const result = await shopProductService.removeProductFromShop(shopId, productId, req.user, ipAddress);
      return sendSuccess(res, 200, result.message);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ShopProductController();
