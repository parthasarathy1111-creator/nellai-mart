'use strict';

const ROLES = Object.freeze({
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
});

const ALL_ROLES = Object.values(ROLES);

module.exports = { ROLES, ALL_ROLES };
