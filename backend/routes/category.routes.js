'use strict';

const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { createCategoryValidator, updateCategoryValidator } = require('../validators/category.validator');
const validate = require('../middleware/validate');
const { authenticate, authorize } = require('../middleware/auth');
const { singleUpload } = require('../middleware/upload');
const { ROLES } = require('../constants/roles');

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:id', categoryController.getCategoryById);

// Admin-protected routes
router.post(
  '/',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  singleUpload('image'),
  createCategoryValidator,
  validate,
  categoryController.createCategory
);

router.put(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  singleUpload('image'),
  updateCategoryValidator,
  validate,
  categoryController.updateCategory
);

router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.SUPER_ADMIN, ROLES.ADMIN),
  categoryController.deleteCategory
);

module.exports = router;
