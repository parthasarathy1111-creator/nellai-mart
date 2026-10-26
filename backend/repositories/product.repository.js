'use strict';

const Product = require('../models/Product');

class ProductRepository {
  async findAll({ filter = {}, search = '', page = 1, limit = 20, sort = { createdAt: -1 } }) {
    const query = { ...filter };
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug icon')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query),
    ]);
    return { products, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id) {
    return Product.findById(id).populate('category', 'name slug icon description');
  }

  async findBySlug(slug) {
    return Product.findOne({ slug }).populate('category', 'name slug icon description');
  }

  async create(data) {
    return Product.create(data);
  }

  async update(id, data) {
    return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('category', 'name slug icon');
  }

  async delete(id) {
    return Product.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return Product.countDocuments(filter);
  }
}

module.exports = new ProductRepository();
