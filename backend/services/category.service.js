'use strict';

const categoryRepository = require('../repositories/category.repository');
const generateSlug = require('../utils/slugify');
const { uploadImage, deleteImage } = require('../config/cloudinary');
const logActivity = require('../utils/activityLogger');
const { HTTP_STATUS } = require('../constants/messages');

class CategoryService {
  async getAllCategories({ page = 1, limit = 50, isActive, search } = {}) {
    const filter = {};
    if (typeof isActive === 'boolean') {
      filter.isActive = isActive;
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    return categoryRepository.findAll({ filter, page: Number(page), limit: Number(limit) });
  }

  async getCategoryBySlug(slug) {
    const category = await categoryRepository.findBySlug(slug);
    if (!category) {
      const error = new Error('Category not found.');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }
    return category;
  }

  async getCategoryById(id) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      const error = new Error('Category not found.');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }
    return category;
  }

  async createCategory(categoryData, file, adminUser, ipAddress) {
    const slug = generateSlug(categoryData.name);
    const existing = await categoryRepository.findBySlug(slug);
    if (existing) {
      const error = new Error(`Category with name "${categoryData.name}" already exists.`);
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      throw error;
    }

    let image = categoryData.image || '';
    let imagePublicId = '';

    if (file) {
      const uploadRes = await uploadImage(file, 'nellai-mart/categories');
      image = uploadRes.url;
      imagePublicId = uploadRes.publicId;
    }

    const newCategory = await categoryRepository.create({
      ...categoryData,
      slug,
      image,
      imagePublicId,
    });

    logActivity({
      adminId: adminUser.id,
      action: 'CATEGORY_CREATE',
      module: 'CATEGORIES',
      description: `Created category: ${newCategory.name}`,
      ipAddress,
    });

    return newCategory;
  }

  async updateCategory(id, updateData, file, adminUser, ipAddress) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      const error = new Error('Category not found.');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (updateData.name && updateData.name !== category.name) {
      updateData.slug = generateSlug(updateData.name);
      const existing = await categoryRepository.findBySlug(updateData.slug);
      if (existing && existing._id.toString() !== id) {
        const error = new Error(`Category with name "${updateData.name}" already exists.`);
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
      }
    }

    let oldPublicId = null;

    if (file) {
      // 1. Upload new image FIRST
      const uploadRes = await uploadImage(file, 'nellai-mart/categories');
      updateData.image = uploadRes.url;
      updateData.imagePublicId = uploadRes.publicId;
      if (category.imagePublicId) {
        oldPublicId = category.imagePublicId;
      }
    } else if (updateData.removeImage === true || updateData.removeImage === 'true') {
      // Admin requested explicit removal of category image
      updateData.image = '';
      updateData.imagePublicId = '';
      if (category.imagePublicId) {
        oldPublicId = category.imagePublicId;
      }
    }

    // 2. Database update
    const updated = await categoryRepository.update(id, updateData);

    // 3. Old image cleanup AFTER DB update succeeds
    if (oldPublicId) {
      try {
        await deleteImage(oldPublicId);
      } catch (err) {
        console.warn(`⚠️ Failed to cleanup old category image (${oldPublicId}):`, err.message);
      }
    }

    logActivity({
      adminId: adminUser?.id || adminUser?._id,
      action: 'CATEGORY_UPDATE',
      module: 'CATEGORIES',
      description: `Updated category: ${updated.name}`,
      ipAddress,
    });

    return updated;
  }


  async deleteCategory(id, adminUser, ipAddress) {
    const category = await categoryRepository.findById(id);
    if (!category) {
      const error = new Error('Category not found.');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (category.imagePublicId) {
      await deleteImage(category.imagePublicId);
    }

    await categoryRepository.delete(id);

    logActivity({
      adminId: adminUser.id,
      action: 'CATEGORY_DELETE',
      module: 'CATEGORIES',
      description: `Deleted category: ${category.name}`,
      ipAddress,
    });

    return { message: 'Category deleted successfully.' };
  }
}

module.exports = new CategoryService();
