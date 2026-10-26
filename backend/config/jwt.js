'use strict';

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'nellai_mart_jwt_super_secret_key_2026_hyperlocal_discovery';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Sign a JWT token for the given payload.
 * @param {object} payload
 * @returns {string}
 */
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token.
 * @param {string} token
 * @returns {object} decoded payload
 * @throws {JsonWebTokenError|TokenExpiredError}
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

const generateToken = signToken;

module.exports = { signToken, generateToken, verifyToken };
