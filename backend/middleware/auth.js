'use strict';

const { verifyToken } = require('../config/jwt');
const Admin = require('../models/Admin');
const { sendError } = require('../utils/response');
const { MESSAGES } = require('../constants/messages');
const { ROLES } = require('../constants/roles');

/**
 * Middleware: verify Bearer JWT token and attach admin to req.admin & req.user.
 */
async function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, MESSAGES.UNAUTHORIZED);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    const admin = await Admin.findById(decoded.id).select('-password');

    if (!admin || !admin.isActive) {
      return sendError(res, 401, MESSAGES.UNAUTHORIZED);
    }

    req.admin = admin;
    req.user = admin;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendError(res, 401, MESSAGES.TOKEN_EXPIRED);
    }
    return sendError(res, 401, MESSAGES.UNAUTHORIZED);
  }
}

/**
 * Middleware factory: restrict access to specified roles.
 * Must be used after `authenticate`.
 * @param {...string} roles
 */
function requireRole(...roles) {
  return (req, res, next) => {
    const user = req.user || req.admin;
    if (!user) {
      return sendError(res, 401, MESSAGES.UNAUTHORIZED);
    }

    if (!roles.includes(user.role)) {
      return sendError(res, 403, MESSAGES.FORBIDDEN);
    }

    next();
  };
}

const authorize = requireRole;
const requireSuperAdmin = requireRole(ROLES.SUPER_ADMIN);

module.exports = { authenticate, authorize, requireRole, requireSuperAdmin };
