'use strict';

const bannerRepository = require('../repositories/banner.repository');
const { uploadImage, deleteImage } = require('../config/cloudinary');
const logActivity = require('../utils/activityLogger');
const { HTTP_STATUS } = require('../constants/messages');

class BannerService {
  async getBanners({ activeOnly = true } = {}) {
    const filter = {};
    if (activeOnly) filter.isActive = true;
    return bannerRepository.findAll({ filter });
  }

  async createBanner(data, file, adminUser, ipAddress) {
    let imageUrl = '';
    let imagePublicId = '';

    if (file) {
      const uploadRes = await uploadImage(file, 'nellai-mart/banners');
      imageUrl = uploadRes.url;
      imagePublicId = uploadRes.publicId;
    } else {
      const error = new Error('Banner image file is required.');
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      throw error;
    }

    const banner = await bannerRepository.create({
      ...data,
      imageUrl,
      imagePublicId,
    });

    logActivity({
      adminId: adminUser.id,
      action: 'BANNER_CREATE',
      module: 'BANNERS',
      description: `Created homepage banner: ${banner.title}`,
      ipAddress,
    });

    return banner;
  }

  async updateBanner(id, updateData, file, adminUser, ipAddress) {
    const banner = await bannerRepository.findById(id);
    if (!banner) {
      const error = new Error('Banner not found.');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (file) {
      if (banner.imagePublicId) await deleteImage(banner.imagePublicId);
      const uploadRes = await uploadImage(file, 'nellai-mart/banners');
      updateData.imageUrl = uploadRes.url;
      updateData.imagePublicId = uploadRes.publicId;
    }

    const updated = await bannerRepository.update(id, updateData);

    logActivity({
      adminId: adminUser.id,
      action: 'BANNER_UPDATE',
      module: 'BANNERS',
      description: `Updated homepage banner: ${updated.title}`,
      ipAddress,
    });

    return updated;
  }

  async deleteBanner(id, adminUser, ipAddress) {
    const banner = await bannerRepository.findById(id);
    if (!banner) {
      const error = new Error('Banner not found.');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (banner.imagePublicId) await deleteImage(banner.imagePublicId);
    await bannerRepository.delete(id);

    logActivity({
      adminId: adminUser.id,
      action: 'BANNER_DELETE',
      module: 'BANNERS',
      description: `Deleted banner: ${banner.title}`,
      ipAddress,
    });

    return { message: 'Banner deleted successfully.' };
  }
}

module.exports = new BannerService();
