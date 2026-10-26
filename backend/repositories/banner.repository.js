'use strict';

const Banner = require('../models/Banner');

class BannerRepository {
  async findAll({ filter = {}, sort = { sortOrder: 1, createdAt: -1 } } = {}) {
    return Banner.find(filter).sort(sort).lean();
  }

  async findById(id) {
    return Banner.findById(id);
  }

  async create(data) {
    return Banner.create(data);
  }

  async update(id, data) {
    return Banner.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return Banner.findByIdAndDelete(id);
  }
}

module.exports = new BannerRepository();
