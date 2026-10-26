'use strict';

const categoryService = require('../services/category.service');
const { sendSuccess } = require('../utils/response');

class CategoryController {
  async getAllCategories(req, res, next) {
    try {
      const { page, limit, isActive, search } = req.query;
      const parsedIsActive = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
      const result = await categoryService.getAllCategories({ page, limit, isActive: parsedIsActive, search });
      return sendSuccess(res, 200, 'Categories retrieved successfully.', result.categories, {
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

  async getCategoryBySlug(req, res, next) {
    try {
      const category = await categoryService.getCategoryBySlug(req.params.slug);
      return sendSuccess(res, 200, 'Category retrieved successfully.', category);
    } catch (error) {
      next(error);
    }
  }

  async getCategoryById(req, res, next) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      return sendSuccess(res, 200, 'Category retrieved successfully.', category);
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req, res, next) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const category = await categoryService.createCategory(req.body, req.file, req.user, ipAddress);
      return sendSuccess(res, 201, 'Category created successfully.', category);
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const category = await categoryService.updateCategory(req.params.id, req.body, req.file, req.user, ipAddress);
      return sendSuccess(res, 200, 'Category updated successfully.', category);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const result = await categoryService.deleteCategory(req.params.id, req.user, ipAddress);
      return sendSuccess(res, 200, result.message);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();
