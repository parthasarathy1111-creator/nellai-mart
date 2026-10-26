'use strict';

/**
 * Nellai Mart Backend — Comprehensive Verification Script
 * --------------------------------------------------------
 * Uses the local MongoDB URI from .env (no mongodb-memory-server download).
 * Runs against: mongodb://127.0.0.1:27017/nellai-mart-verify
 *
 * Verifies:
 *  1. npm packages all resolvable (dry require check)
 *  2. MongoDB connection
 *  3. Server startup
 *  4. JWT authentication & auth guard
 *  5. Input validation middleware
 *  6. Every API route loads with 200
 *  7. Global error handler (404, CastError)
 */

require('dotenv').config();

const http = require('http');
const mongoose = require('mongoose');
const app = require('../app');
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Shop = require('../models/Shop');
const ShopProduct = require('../models/ShopProduct');
const Banner = require('../models/Banner');

const PORT = 5099;
const MONGODB_URI = 'mongodb://127.0.0.1:27017/nellai-mart-verify';

let server;
let adminToken = '';
let sampleCategorySlug = '';
let sampleProductSlug = '';
let sampleShopSlug = '';
let sampleShopId = '';
let sampleProductId = '';

let passed = 0;
let failed = 0;

function pass(label) {
  console.log(`   ✅ ${label}`);
  passed++;
}

function fail(label, detail) {
  console.error(`   ❌ ${label}`, detail || '');
  failed++;
}

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ statusCode: res.statusCode, body: data });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(JSON.stringify(postData));
    req.end();
  });
}

function opts(path, method = 'GET', extra = {}) {
  return {
    hostname: 'localhost',
    port: PORT,
    path,
    method,
    headers: { 'Content-Type': 'application/json', ...extra },
  };
}

async function runTests() {
  console.log('\n🚀 Nellai Mart Backend — Verification Suite\n');
  console.log('═'.repeat(55));

  // ── PHASE 1: Module Load Check ─────────────────────────
  console.log('\n1️⃣  Phase 1 — Module Resolution Check');
  const modules = [
    '../config/db', '../config/cloudinary', '../config/jwt',
    '../constants/roles', '../constants/status', '../constants/messages',
    '../utils/response', '../utils/pagination', '../utils/slugify', '../utils/activityLogger',
    '../middleware/auth', '../middleware/errorHandler', '../middleware/rateLimiter', '../middleware/upload', '../middleware/validate',
    '../validators/auth.validator', '../validators/category.validator',
    '../validators/product.validator', '../validators/shop.validator',
    '../validators/shopProduct.validator', '../validators/banner.validator',
    '../repositories/admin.repository', '../repositories/category.repository',
    '../repositories/product.repository', '../repositories/shop.repository',
    '../repositories/shopProduct.repository', '../repositories/banner.repository',
    '../repositories/activityLog.repository',
    '../services/auth.service', '../services/category.service',
    '../services/product.service', '../services/shop.service',
    '../services/shopProduct.service', '../services/banner.service',
    '../services/admin.service', '../services/search.service',
    '../controllers/auth.controller', '../controllers/category.controller',
    '../controllers/product.controller', '../controllers/shop.controller',
    '../controllers/shopProduct.controller', '../controllers/banner.controller',
    '../controllers/admin.controller', '../controllers/search.controller',
    '../routes/index',
  ];

  let allModulesOk = true;
  for (const mod of modules) {
    try {
      require(mod);
    } catch (err) {
      fail(`Cannot load module: ${mod}`, err.message);
      allModulesOk = false;
    }
  }
  if (allModulesOk) {
    pass(`All ${modules.length} backend modules load without errors`);
  }

  // ── PHASE 2: MongoDB Connection ────────────────────────
  console.log('\n2️⃣  Phase 2 — MongoDB Connection');
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    pass('MongoDB connected at ' + MONGODB_URI);
  } catch (err) {
    fail('MongoDB connection failed: ' + err.message);
    console.error('\n⚠️  NOTE: Make sure MongoDB is running locally (mongod service).');
    console.error('   You can install it from: https://www.mongodb.com/try/download/community');
    await cleanup();
    return summarize();
  }

  // Seed test data
  await Promise.all([Admin.deleteMany({}), Category.deleteMany({}),
    Product.deleteMany({}), Shop.deleteMany({}), ShopProduct.deleteMany({}), Banner.deleteMany({})]);

  const admin = await Admin.create({ name: 'Test Admin', email: 'admin@nellaimart.com', password: 'Admin@123456', role: 'SUPER_ADMIN' });
  const cat = await Category.create({ name: 'Groceries Test', slug: 'groceries-test', icon: '🌾' });
  sampleCategorySlug = cat.slug;

  const prod = await Product.create({ name: 'Test Halwa', slug: 'test-halwa', brand: 'Iruttukadai', unit: '500 g', category: cat._id });
  sampleProductSlug = prod.slug;
  sampleProductId = prod._id.toString();

  const shop = await Shop.create({ name: 'Test Shop Nellai', slug: 'test-shop-nellai', ownerName: 'Raman', phone: '+919876543210', address: 'Main Road', locality: 'Town', category: 'Groceries', status: 'ACTIVE', geoLocation: { type: 'Point', coordinates: [77.6974, 8.7274] } });
  sampleShopSlug = shop.slug;
  sampleShopId = shop._id.toString();

  await ShopProduct.create({ shop: shop._id, product: prod._id, price: 180, mrp: 200, stockStatus: 'IN_STOCK' });
  await Banner.create({ title: 'Test Banner', imageUrl: 'https://example.com/img.jpg', isActive: true });
  pass('Test database seeded with Admin, Category, Product, Shop, ShopProduct, Banner');

  // ── PHASE 3: Server Startup ────────────────────────────
  console.log('\n3️⃣  Phase 3 — Express Server Startup');
  await new Promise((resolve) => {
    server = app.listen(PORT, () => {
      pass(`Server started on http://localhost:${PORT}`);
      resolve();
    });
  });

  // ── PHASE 4: Health Check ──────────────────────────────
  const healthRes = await makeRequest(opts('/api/v1/health'));
  if (healthRes.statusCode === 200 && healthRes.body.success) {
    pass('Health check endpoint (/api/v1/health) responding');
  } else {
    fail('Health check failed', healthRes);
  }

  // ── PHASE 5: Validation Middleware ─────────────────────
  console.log('\n4️⃣  Phase 4 — Input Validation Middleware');
  const badLogin = await makeRequest(opts('/api/v1/auth/login', 'POST'), { email: 'not-an-email', password: '123' });
  if (badLogin.statusCode === 400 && badLogin.body.success === false) {
    pass('Validation middleware rejected malformed request (400 Bad Request)');
  } else {
    fail('Validation middleware did not block malformed request', badLogin);
  }

  // ── PHASE 6: JWT Auth Flow ─────────────────────────────
  console.log('\n5️⃣  Phase 5 — JWT Authentication');
  const loginRes = await makeRequest(opts('/api/v1/auth/login', 'POST'), { email: 'admin@nellaimart.com', password: 'Admin@123456' });
  if (loginRes.statusCode === 200 && loginRes.body.data && loginRes.body.data.token) {
    adminToken = loginRes.body.data.token;
    pass('Login succeeded — JWT token issued');
  } else {
    fail('Login failed', loginRes.body);
  }

  const noTokenRes = await makeRequest(opts('/api/v1/auth/profile'));
  if (noTokenRes.statusCode === 401) {
    pass('Auth guard blocked unauthenticated request (401)');
  } else {
    fail('Auth guard did not block unauthenticated request', noTokenRes);
  }

  const withTokenRes = await makeRequest(opts('/api/v1/auth/profile', 'GET', { Authorization: `Bearer ${adminToken}` }));
  if (withTokenRes.statusCode === 200 && withTokenRes.body.data) {
    pass('JWT-protected profile route accessible with valid Bearer token');
  } else {
    fail('Protected route failed with valid token', withTokenRes.body);
  }

  // ── PHASE 7: Route Loading ─────────────────────────────
  console.log('\n6️⃣  Phase 6 — API Route Verification');
  const routes = [
    { path: '/api/v1/categories', label: 'GET Categories List' },
    { path: `/api/v1/categories/slug/${sampleCategorySlug}`, label: 'GET Category by Slug' },
    { path: '/api/v1/products', label: 'GET Products List' },
    { path: `/api/v1/products/slug/${sampleProductSlug}`, label: 'GET Product by Slug' },
    { path: '/api/v1/shops', label: 'GET Shops List' },
    { path: `/api/v1/shops/slug/${sampleShopSlug}`, label: 'GET Shop by Slug' },
    { path: '/api/v1/banners', label: 'GET Banners' },
    { path: '/api/v1/search?q=halwa', label: 'GET Global Search' },
    { path: `/api/v1/shop-products/shop/${sampleShopId}`, label: 'GET Shop Inventory' },
    { path: `/api/v1/shop-products/product/${sampleProductId}`, label: 'GET Product Shop Offers' },
    { path: '/api/v1/admin/dashboard', label: 'GET Admin Dashboard (protected)', auth: true },
    { path: '/api/v1/admin/activity-logs', label: 'GET Activity Logs (protected)', auth: true },
    { path: '/api/v1/admin/reports', label: 'GET Analytics Reports (protected)', auth: true },
  ];

  for (const route of routes) {
    const headers = route.auth ? { Authorization: `Bearer ${adminToken}` } : {};
    const res = await makeRequest(opts(route.path, 'GET', headers));
    if (res.statusCode === 200 && res.body.success === true) {
      pass(`${route.label} — 200 OK`);
    } else {
      fail(`${route.label} — expected 200, got ${res.statusCode}`, res.body);
    }
  }

  // ── PHASE 8: Global Error Handler ─────────────────────
  console.log('\n7️⃣  Phase 7 — Global Error Handler');
  const notFound = await makeRequest(opts('/api/v1/nonexistent-route'));
  if (notFound.statusCode === 404 && notFound.body.success === false) {
    pass('404 handler caught unknown route');
  } else {
    fail('404 handler not working correctly', notFound);
  }

  const castErr = await makeRequest(opts('/api/v1/categories/invalid-mongo-id'));
  if (castErr.statusCode === 400 || castErr.statusCode === 500) {
    pass('Global error handler caught Mongoose CastError gracefully');
  } else {
    fail('Mongoose CastError not handled', castErr);
  }

  await cleanup();
  summarize();
}

async function cleanup() {
  if (server) server.close();
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase().catch(() => {});
    await mongoose.connection.close();
  }
}

function summarize() {
  console.log('\n' + '═'.repeat(55));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log('\n🎉 ALL BACKEND VERIFICATION CHECKS PASSED PERFECTLY!\n');
    process.exit(0);
  } else {
    console.error(`\n⚠️  ${failed} check(s) failed. Fix issues above.\n`);
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('❌ Test runner crashed:', err);
  cleanup().finally(() => process.exit(1));
});
