'use strict';

const productRepository = require('../repositories/product.repository');
const shopRepository = require('../repositories/shop.repository');
const categoryRepository = require('../repositories/category.repository');

class SearchService {
  async globalSearch({ query = '', lat, lng, page = 1, limit = 20 }) {
    if (!query || !query.trim()) {
      return {
        query: '',
        products: [],
        shops: [],
        categories: [],
      };
    }

    const trimmedQuery = query.trim();

    const [productsResult, shopsResult, categoriesResult] = await Promise.all([
      productRepository.findAll({
        search: trimmedQuery,
        filter: { isActive: true },
        page: 1,
        limit: 10,
      }),
      shopRepository.findAll({
        search: trimmedQuery,
        filter: { status: 'ACTIVE' },
        near: (lat != null && lng != null) ? { lat, lng } : null,
        page: 1,
        limit: 10,
      }),
      categoryRepository.findAll({
        filter: { name: { $regex: trimmedQuery, $options: 'i' }, isActive: true },
        page: 1,
        limit: 5,
      }),
    ]);

    return {
      query: trimmedQuery,
      products: productsResult.products,
      shops: shopsResult.shops,
      categories: categoriesResult.categories,
      totalResults: productsResult.total + shopsResult.total + categoriesResult.total,
    };
  }
}

module.exports = new SearchService();
