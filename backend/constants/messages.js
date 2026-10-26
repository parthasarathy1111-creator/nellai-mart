'use strict';

const MESSAGES = Object.freeze({
  // Auth
  LOGIN_SUCCESS: 'Logged in successfully.',
  LOGIN_INVALID: 'Invalid email or password.',
  LOGOUT_SUCCESS: 'Logged out successfully.',
  UNAUTHORIZED: 'Authentication required. Please provide a valid token.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  TOKEN_EXPIRED: 'Session expired. Please log in again.',

  // Generic CRUD
  CREATED: (entity) => `${entity} created successfully.`,
  UPDATED: (entity) => `${entity} updated successfully.`,
  DELETED: (entity) => `${entity} deleted successfully.`,
  FETCHED: (entity) => `${entity} retrieved successfully.`,
  NOT_FOUND: (entity) => `${entity} not found.`,
  ALREADY_EXISTS: (entity) => `${entity} already exists.`,

  // Validation
  VALIDATION_ERROR: 'Validation failed. Please check the provided data.',

  // Upload
  UPLOAD_SUCCESS: 'Image uploaded successfully.',
  UPLOAD_FAILED: 'Image upload failed.',

  // Server
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
});

const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  SERVER_ERROR: 500,
});

module.exports = { MESSAGES, HTTP_STATUS };
