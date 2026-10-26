'use strict';

const shopProductRepository = require('../repositories/shopProduct.repository');
const logActivity = require('../utils/activityLogger');
const { HTTP_STATUS } = require('../constants/messages');

class ShopProductService {
  async getShopProducts(shopId, { page = 1, limit = 50 } = {}) {
    return shopProductRepository.findByShopId(shopId, { page: Number(page), limit: Number(limit) });
  }

  async getProductShops(productId, { page = 1, limit = 20 } = {}) {
    return shopProductRepository.findByProductId(productId, { page: Number(page), limit: Number(limit) });
  }

  async addOrUpdateProductInShop(data, adminUser, ipAddress) {
    const { shop, product, price, mrp, stockStatus, isAvailable, discountText } = data;

    let shopProduct = await shopProductRepository.findOne(shop, product);

    if (shopProduct) {
      shopProduct = await shopProductRepository.update(shopProduct._id, {
        price,
        mrp: mrp || shopProduct.mrp,
        stockStatus: stockStatus || shopProduct.stockStatus,
        isAvailable: isAvailable !== undefined ? isAvailable : shopProduct.isAvailable,
        discountText: discountText !== undefined ? discountText : shopProduct.discountText,
      });

      logActivity({
        adminId: adminUser.id,
        action: 'SHOP_PRODUCT_UPDATE',
        module: 'SHOPS',
        description: `Updated price/stock for product in shop`,
        ipAddress,
      });
    } else {
      shopProduct = await shopProductRepository.create({
        shop,
        product,
        price,
        mrp: mrp || price,
        stockStatus: stockStatus || 'IN_STOCK',
        isAvailable: isAvailable !== undefined ? isAvailable : true,
        discountText,
      });

      logActivity({
        adminId: adminUser.id,
        action: 'SHOP_PRODUCT_ADD',
        module: 'SHOPS',
        description: `Added product to shop inventory`,
        ipAddress,
      });
    }

    return shopProduct;
  }

  async removeProductFromShop(shopId, productId, adminUser, ipAddress) {
    const deleted = await shopProductRepository.deleteByShopAndProduct(shopId, productId);
    if (!deleted) {
      const error = new Error('Mapping not found.');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    logActivity({
      adminId: adminUser.id,
      action: 'SHOP_PRODUCT_REMOVE',
      module: 'SHOPS',
      description: `Removed product from shop inventory`,
      ipAddress,
    });

    return { message: 'Product removed from shop inventory successfully.' };
  }
}

module.exports = new ShopProductService();
