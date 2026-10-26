'use strict';

const ShopProduct = require('../models/ShopProduct');

class ShopProductRepository {
  async findByShopId(shopId, { page = 1, limit = 50, filter = {} } = {}) {
    const skip = (page - 1) * limit;
    const query = { shop: shopId, ...filter };

    const [shopProducts, total] = await Promise.all([
      ShopProduct.find(query)
        .populate({
          path: 'product',
          populate: { path: 'category', select: 'name slug icon' },
        })
        .skip(skip)
        .limit(limit)
        .lean(),
      ShopProduct.countDocuments(query),
    ]);

    return { shopProducts, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findByProductId(productId, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    const query = { product: productId, isAvailable: true };

    const [shopProducts, total] = await Promise.all([
      ShopProduct.find(query)
        .populate('shop', 'name slug logo bannerAddress phone locality timing rating reviewCount isOpen isVerified')
        .skip(skip)
        .limit(limit)
        .lean(),
      ShopProduct.countDocuments(query),
    ]);

    return { shopProducts, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(shopId, productId) {
    return ShopProduct.findOne({ shop: shopId, product: productId });
  }

  async create(data) {
    return ShopProduct.create(data);
  }

  async update(id, data) {
    return ShopProduct.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return ShopProduct.findByIdAndDelete(id);
  }

  async deleteByShopAndProduct(shopId, productId) {
    return ShopProduct.findOneAndDelete({ shop: shopId, product: productId });
  }

  async count(filter = {}) {
    return ShopProduct.countDocuments(filter);
  }
}

module.exports = new ShopProductRepository();
