'use strict';

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants/roles');

const { updateSettingsValidator } = require('../validators/setting.validator');
const validate = require('../middleware/validate');

router.use(authenticate);
router.use(authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN));

router.get('/dashboard', adminController.getDashboardStats);
router.get('/activity-logs', adminController.getActivityLogs);
router.get('/reports', adminController.getReports);
router.get('/settings', adminController.getSettings);
router.put('/settings', updateSettingsValidator, validate, adminController.updateSettings);

module.exports = router;

