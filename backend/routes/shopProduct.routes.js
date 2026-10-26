'use strict';

const express = require('express');
const router = express.Router();
const shopProductController = require('../controllers/shopProduct.controller');
const { createShopProductValidator, updateShopProductValidator } = require('../validators/shopProduct.validator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { ROLES } = require('../constants/roles');

// Public routes
router.get('/shop/:shopId', shopProductController.getShopProducts);
router.get('/product/:productId', shopProductController.getProductShops);

// Admin routes
router.post(
  '/',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  createShopProductValidator,
  validate,
  shopProductController.addOrUpdateProductInShop
);

router.delete(
  '/shop/:shopId/product/:productId',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  shopProductController.removeProductFromShop
);

module.exports = router;
