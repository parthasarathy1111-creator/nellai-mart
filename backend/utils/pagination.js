'use strict';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

/**
 * Parse pagination params from request query.
 * @param {object} query - Express req.query
 * @returns {{ skip: number, limit: number, page: number }}
 */
function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || DEFAULT_PAGE);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(query.limit, 10) || DEFAULT_LIMIT)
  );
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/**
 * Build pagination metadata for response.
 * @param {number} total - total document count
 * @param {number} page
 * @param {number} limit
 * @returns {object}
 */
function buildPaginationMeta(total, page, limit) {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

module.exports = { parsePagination, buildPaginationMeta };
