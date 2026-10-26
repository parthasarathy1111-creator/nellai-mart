'use strict';

const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/banner.controller');
const { createBannerValidator, updateBannerValidator } = require('../validators/banner.validator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { singleUpload } = require('../middleware/upload');
const { ROLES } = require('../constants/roles');

// Public route
router.get('/', bannerController.getBanners);

// Admin routes
router.post(
  '/',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  singleUpload('image'),
  createBannerValidator,
  validate,
  bannerController.createBanner
);

router.put(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  singleUpload('image'),
  updateBannerValidator,
  validate,
  bannerController.updateBanner
);

router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  bannerController.deleteBanner
);

module.exports = router;
