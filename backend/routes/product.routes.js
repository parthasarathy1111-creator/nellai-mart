'use strict';

const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { createProductValidator, updateProductValidator } = require('../validators/product.validator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { fieldsUpload } = require('../middleware/upload');
const { ROLES } = require('../constants/roles');

const productUpload = fieldsUpload([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);

// Public routes
router.get('/', productController.getAllProducts);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id', productController.getProductById);

// Admin routes
router.post(
  '/',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  productUpload,
  createProductValidator,
  validate,
  productController.createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  productUpload,
  updateProductValidator,
  validate,
  productController.updateProduct
);


router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  productController.deleteProduct
);

module.exports = router;
