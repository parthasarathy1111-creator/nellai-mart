'use strict';

const Shop = require('../models/Shop');

class ShopRepository {
  async findAll({ filter = {}, search = '', near = null, maxDistanceKm = 10, page = 1, limit = 20, sort = { isFeatured: -1, rating: -1 } }) {
    const query = { ...filter };

    if (search) {
      query.$text = { $search: search };
    }

    if (near && near.lng != null && near.lat != null) {
      query.geoLocation = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(near.lng), parseFloat(near.lat)],
          },
          $maxDistance: maxDistanceKm * 1000,
        },
      };
    }

    const skip = (page - 1) * limit;
    const [shops, total] = await Promise.all([
      Shop.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Shop.countDocuments(query),
    ]);

    return { shops, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id) {
    return Shop.findById(id);
  }

  async findBySlug(slug) {
    return Shop.findOne({ slug });
  }

  async create(data) {
    return Shop.create(data);
  }

  async update(id, data) {
    return Shop.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return Shop.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return Shop.countDocuments(filter);
  }
}

module.exports = new ShopRepository();
