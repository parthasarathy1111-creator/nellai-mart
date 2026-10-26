'use strict';

const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop.controller');
const { createShopValidator, updateShopValidator } = require('../validators/shop.validator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { fieldsUpload } = require('../middleware/upload');
const { ROLES } = require('../constants/roles');

// Public routes
router.get('/', shopController.getAllShops);
router.get('/slug/:slug', shopController.getShopBySlug);
router.get('/:id', shopController.getShopById);

// Admin routes
router.post(
  '/',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  fieldsUpload([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
  ]),
  createShopValidator,
  validate,
  shopController.createShop
);

router.put(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  fieldsUpload([
    { name: 'logo', maxCount: 1 },
    { name: 'banner', maxCount: 1 },
  ]),
  updateShopValidator,
  validate,
  shopController.updateShop
);

router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  shopController.deleteShop
);

module.exports = router;
