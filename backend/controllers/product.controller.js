'use strict';

const productService = require('../services/product.service');
const { sendSuccess } = require('../utils/response');

class ProductController {
  async getAllProducts(req, res, next) {
    try {
      const { page, limit, search, category, brand, isFeatured, isActive } = req.query;
      const parsedIsActive = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
      const parsedIsFeatured = isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined;

      const result = await productService.getAllProducts({
        page,
        limit,
        search,
        category,
        brand,
        isFeatured: parsedIsFeatured,
        isActive: parsedIsActive,
      });

      return sendSuccess(res, 200, 'Products retrieved successfully.', result.products, {
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

  async getProductBySlug(req, res, next) {
    try {
      const product = await productService.getProductBySlug(req.params.slug);
      return sendSuccess(res, 200, 'Product details retrieved successfully.', product);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(req, res, next) {
    try {
      const product = await productService.getProductById(req.params.id);
      return sendSuccess(res, 200, 'Product retrieved successfully.', product);
    } catch (error) {
      next(error);
    }
  }

  async createProduct(req, res, next) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const files = req.files
        ? (Array.isArray(req.files) ? req.files : [...(req.files.image || []), ...(req.files.images || [])])
        : (req.file ? [req.file] : []);
      const product = await productService.createProduct(req.body, files, req.user, ipAddress);
      return sendSuccess(res, 201, 'Product created successfully.', product);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const files = req.files
        ? (Array.isArray(req.files) ? req.files : [...(req.files.image || []), ...(req.files.images || [])])
        : (req.file ? [req.file] : []);
      const product = await productService.updateProduct(req.params.id, req.body, files, req.user, ipAddress);
      return sendSuccess(res, 200, 'Product updated successfully.', product);
    } catch (error) {
      next(error);
    }
  }


  async deleteProduct(req, res, next) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress;
      const result = await productService.deleteProduct(req.params.id, req.user, ipAddress);
      return sendSuccess(res, 200, result.message);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();
