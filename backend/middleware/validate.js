'use strict';

const { validationResult } = require('express-validator');
const { sendError } = require('../utils/response');
const { MESSAGES } = require('../constants/messages');

/**
 * Middleware: run express-validator result check.
 * If validation fails, returns a 422 with structured error list.
 * Place AFTER validator chains in the route definition.
 */
function validate(req, res, next) {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const errors = result.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return sendError(res, 400, MESSAGES.VALIDATION_ERROR, errors);
  }

  next();
}

module.exports = validate;
