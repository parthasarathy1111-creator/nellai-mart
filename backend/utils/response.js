'use strict';

/**
 * Send a standardised success response.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {any} data
 * @param {object} [pagination]
 */
function sendSuccess(res, statusCode, message, data = null, pagination = null) {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  if (pagination !== null) payload.pagination = pagination;
  return res.status(statusCode).json(payload);
}

/**
 * Send a standardised error response.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {Array} [errors]
 */
function sendError(res, statusCode, message, errors = []) {
  return res.status(statusCode).json({ success: false, message, errors });
}

module.exports = { sendSuccess, sendError };
