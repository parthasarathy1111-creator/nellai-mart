'use strict';

const productRepository = require('../repositories/product.repository');
const shopProductRepository = require('../repositories/shopProduct.repository');
const generateSlug = require('../utils/slugify');
const { uploadImage, deleteImage } = require('../config/cloudinary');
const logActivity = require('../utils/activityLogger');
const { HTTP_STATUS } = require('../constants/messages');

class ProductService {
  async getAllProducts({ page = 1, limit = 20, search, category, brand, isFeatured, isActive } = {}) {
    const filter = {};
    if (typeof isActive === 'boolean') filter.isActive = isActive;
    if (typeof isFeatured === 'boolean') filter.isFeatured = isFeatured;
    if (category) filter.category = category;
    if (brand) filter.brand = { $regex: brand, $options: 'i' };

    return productRepository.findAll({
      filter,
      search,
      page: Number(page),
      limit: Number(limit),
    });
  }

  async getProductBySlug(slug) {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    // Attach shops offering this product
    const shopProductsResult = await shopProductRepository.findByProductId(product._id);

    return {
      ...product.toObject(),
      availableShops: shopProductsResult.shopProducts,
    };
  }

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }
    return product;
  }

  async createProduct(productData, files, adminUser, ipAddress) {
    const slug = generateSlug(productData.name);
    const existing = await productRepository.findBySlug(slug);
    if (existing) {
      const error = new Error(`Product with name "${productData.name}" already exists.`);
      error.statusCode = HTTP_STATUS.BAD_REQUEST;
      throw error;
    }

    const images = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const uploadRes = await uploadImage(file, 'nellai-mart/products');
        images.push({ url: uploadRes.url, publicId: uploadRes.publicId });
      }
    } else if (productData.imageUrl || productData.image) {
      images.push({ url: productData.imageUrl || productData.image, publicId: '' });
    }

    const newProduct = await productRepository.create({
      ...productData,
      slug,
      images,
    });

    logActivity({
      adminId: adminUser?.id || adminUser?._id,
      action: 'PRODUCT_CREATE',
      module: 'PRODUCTS',
      description: `Created product: ${newProduct.name}`,
      ipAddress,
    });

    return newProduct;
  }

  async updateProduct(id, updateData, files, adminUser, ipAddress) {
    const product = await productRepository.findById(id);
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (updateData.name && updateData.name !== product.name) {
      updateData.slug = generateSlug(updateData.name);
      const existing = await productRepository.findBySlug(updateData.slug);
      if (existing && existing._id.toString() !== id) {
        const error = new Error(`Product with name "${updateData.name}" already exists.`);
        error.statusCode = HTTP_STATUS.BAD_REQUEST;
        throw error;
      }
    }

    let oldPublicIds = [];

    if (files && files.length > 0) {
      // 1. Upload new image(s) FIRST
      const images = [];
      for (const file of files) {
        const uploadRes = await uploadImage(file, 'nellai-mart/products');
        images.push({ url: uploadRes.url, publicId: uploadRes.publicId });
      }
      updateData.images = images;
      if (Array.isArray(product.images)) {
        oldPublicIds = product.images.map((img) => (typeof img === 'object' ? img.publicId : '')).filter(Boolean);
      }
    } else if (updateData.removeImage === true || updateData.removeImage === 'true') {
      updateData.images = [];
      if (Array.isArray(product.images)) {
        oldPublicIds = product.images.map((img) => (typeof img === 'object' ? img.publicId : '')).filter(Boolean);
      }
    }

    // 2. Database update
    const updated = await productRepository.update(id, updateData);

    // 3. Old image cleanup AFTER DB update succeeds
    if (oldPublicIds.length > 0) {
      for (const pid of oldPublicIds) {
        try {
          await deleteImage(pid);
        } catch (err) {
          console.warn(`⚠️ Failed to cleanup old product image (${pid}):`, err.message);
        }
      }
    }

    logActivity({
      adminId: adminUser?.id || adminUser?._id,
      action: 'PRODUCT_UPDATE',
      module: 'PRODUCTS',
      description: `Updated product: ${updated.name}`,
      ipAddress,
    });

    return updated;
  }

  async deleteProduct(id, adminUser, ipAddress) {
    const product = await productRepository.findById(id);
    if (!product) {
      const error = new Error('Product not found.');
      error.statusCode = HTTP_STATUS.NOT_FOUND;
      throw error;
    }

    if (Array.isArray(product.images) && product.images.length > 0) {
      for (const img of product.images) {
        const pid = typeof img === 'object' ? img.publicId : '';
        if (pid) {
          try {
            await deleteImage(pid);
          } catch (err) {
            console.warn(`⚠️ Failed to cleanup product image (${pid}):`, err.message);
          }
        }
      }
    }

    await productRepository.delete(id);

    logActivity({
      adminId: adminUser?.id || adminUser?._id,
      action: 'PRODUCT_DELETE',
      module: 'PRODUCTS',
      description: `Deleted product: ${product.name}`,
      ipAddress,
    });

    return { message: 'Product deleted successfully.' };
  }

}

module.exports = new ProductService();
