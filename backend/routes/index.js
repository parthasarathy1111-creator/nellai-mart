'use strict';

const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.routes');
const categoryRoutes = require('./category.routes');
const productRoutes = require('./product.routes');
const shopRoutes = require('./shop.routes');
const shopProductRoutes = require('./shopProduct.routes');
const bannerRoutes = require('./banner.routes');
const adminRoutes = require('./admin.routes');
const searchRoutes = require('./search.routes');

router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/shops', shopRoutes);
router.use('/shop-products', shopProductRoutes);
router.use('/banners', bannerRoutes);
router.use('/admin', adminRoutes);
router.use('/search', searchRoutes);

module.exports = router;
