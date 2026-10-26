'use strict';

const shopRepository = require('../repositories/shop.repository');
const shopProductRepository = require('../repositories/shopProduct.repository');
const generateSlug = require('../utils/slugify');
const { uploadImage, deleteImage } = require('../config/cloudinary');
const logActivity = require('../utils/activityLogger');
const { HTTP_STATUS } = require('../constants/messages');

class ShopService {
  async getAllShops({ page = 1, limit = 20, search, category, locality, status, isVerified, isFeatured, lat, lng, maxDistanceKm } = {}) {
    const filter = {};
    if (status) filter.status = status;
    if (typeof isVerified === 'boolean') filter.isVerified = isVerified;
    if (typeof isFeatured === 'boolean') filter.isFeatured = isFeatured;
    if (category) filter.category = category;
    if (locality) filter.locality = { $regex: locality, $options: 'i' };

    const near = (lat != null && lng != null) ? { lat, lng } : null;

    return shopRepository.findAll({
      filter,
      search,
      near,
      maxDistanceKm: Number(maxDistanceKm) || 10,
      page: Number(page),
      limit: Number(limit),
    });
  }

  async getShopBySlug(slug) {
    const shop = await shopRepository.findBySlug(slug);
    if (!shop) {
      const error = new Error('Shop not found.');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    const shopProductsResult = await shopProductRepository.findByShopId(shop._id, { limit: 100 });

    return {
      ...shop.toObject(),
      inventory: shopProductsResult.shopProducts,
    };
  }

  async getShopById(id) {
    const shop = await shopRepository.findById(id);
    if (!shop) {
      const error = new Error('Shop not found.');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }
    return shop;
  }

  async createShop(shopData, files, adminUser, ipAddress) {
    const slug = generateSlug(shopData.name);
    const existing = await shopRepository.findBySlug(slug);
    if (existing) {
      const error = new Error(`Shop with name "${shopData.name}" already exists.`);
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      throw error;
    }

    let logo = '';
    let logoPublicId = '';
    let bannerAddress = '';
    let bannerPublicId = '';

    if (files) {
      if (files.logo && files.logo[0]) {
        const uploadRes = await uploadImage(files.logo[0], 'nellai-mart/shops/logos');
        logo = uploadRes.url;
        logoPublicId = uploadRes.publicId;
      }
      if (files.banner && files.banner[0]) {
        const uploadRes = await uploadImage(files.banner[0], 'nellai-mart/shops/banners');
        bannerAddress = uploadRes.url;
        bannerPublicId = uploadRes.publicId;
      }
    }

    const newShop = await shopRepository.create({
      ...shopData,
      slug,
      logo,
      logoPublicId,
      bannerAddress,
      bannerPublicId,
    });

    logActivity({
      adminId: adminUser.id,
      action: 'SHOP_CREATE',
      module: 'SHOPS',
      description: `Created shop: ${newShop.name}`,
      ipAddress,
    });

    return newShop;
  }

  async updateShop(id, updateData, files, adminUser, ipAddress) {
    const shop = await shopRepository.findById(id);
    if (!shop) {
      const error = new Error('Shop not found.');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (updateData.name && updateData.name !== shop.name) {
      updateData.slug = generateSlug(updateData.name);
      const existing = await shopRepository.findBySlug(updateData.slug);
      if (existing && existing._id.toString() !== id) {
        const error = new Error(`Shop with name "${updateData.name}" already exists.`);
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
      }
    }

    if (files) {
      if (files.logo && files.logo[0]) {
        if (shop.logoPublicId) await deleteImage(shop.logoPublicId);
        const uploadRes = await uploadImage(files.logo[0], 'nellai-mart/shops/logos');
        updateData.logo = uploadRes.url;
        updateData.logoPublicId = uploadRes.publicId;
      }
      if (files.banner && files.banner[0]) {
        if (shop.bannerPublicId) await deleteImage(shop.bannerPublicId);
        const uploadRes = await uploadImage(files.banner[0], 'nellai-mart/shops/banners');
        updateData.bannerAddress = uploadRes.url;
        updateData.bannerPublicId = uploadRes.publicId;
      }
    }

    const updated = await shopRepository.update(id, updateData);

    logActivity({
      adminId: adminUser.id,
      action: 'SHOP_UPDATE',
      module: 'SHOPS',
      description: `Updated shop: ${updated.name}`,
      ipAddress,
    });

    return updated;
  }

  async deleteShop(id, adminUser, ipAddress) {
    const shop = await shopRepository.findById(id);
    if (!shop) {
      const error = new Error('Shop not found.');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (shop.logoPublicId) await deleteImage(shop.logoPublicId);
    if (shop.bannerPublicId) await deleteImage(shop.bannerPublicId);

    await shopRepository.delete(id);

    logActivity({
      adminId: adminUser.id,
      action: 'SHOP_DELETE',
      module: 'SHOPS',
      description: `Deleted shop: ${shop.name}`,
      ipAddress,
    });

    return { message: 'Shop deleted successfully.' };
  }
}

module.exports = new ShopService();
