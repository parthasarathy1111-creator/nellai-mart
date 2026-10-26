'use strict';

const searchService = require('../services/search.service');
const { sendSuccess } = require('../utils/response');

class SearchController {
  async search(req, res, next) {
    try {
      const { q, lat, lng, page, limit } = req.query;
      const results = await searchService.globalSearch({
        query: q,
        lat: lat ? parseFloat(lat) : undefined,
        lng: lng ? parseFloat(lng) : undefined,
        page,
        limit,
      });
      return sendSuccess(res, 200, 'Search completed successfully.', results);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SearchController();
