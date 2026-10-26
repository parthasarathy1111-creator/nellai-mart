'use strict';

const Category = require('../models/Category');

class CategoryRepository {
  async findAll({ filter = {}, page = 1, limit = 20, sort = { sortOrder: 1, name: 1 } }) {
    const skip = (page - 1) * limit;
    const [categories, total] = await Promise.all([
      Category.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Category.countDocuments(filter),
    ]);
    return { categories, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id) {
    return Category.findById(id);
  }

  async findBySlug(slug) {
    return Category.findOne({ slug });
  }

  async create(data) {
    return Category.create(data);
  }

  async update(id, data) {
    return Category.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return Category.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return Category.countDocuments(filter);
  }
}

module.exports = new CategoryRepository();
