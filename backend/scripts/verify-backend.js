'use strict';

require('dotenv').config();
const http = require('http');
const app = require('../app');
const { generateToken, verifyToken } = require('../config/jwt');
const { ROLES } = require('../constants/roles');

const PORT = 5098;

let passed = 0;
let failed = 0;

function assert(condition, label, details = '') {
  if (condition) {
    console.log(`   ✅ ${label}`);
    passed++;
  } else {
    console.error(`   ❌ ${label}`, details);
    failed++;
  }
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

function opts(path, method = 'GET', extraHeaders = {}) {
  return {
    hostname: 'localhost',
    port: PORT,
    path,
    method,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  };
}

async function verifyBackend() {
  console.log('\n==================================================');
  console.log('  NELLAI MART BACKEND COMPLETE VERIFICATION TEST  ');
  console.log('==================================================\n');

  // 1. Dependency Resolution & Syntax Check
  console.log('1️⃣ Verification Check: Module Resolution');
  const modules = [
    '../app',
    '../config/db', '../config/cloudinary', '../config/jwt',
    '../constants/roles', '../constants/status', '../constants/messages',
    '../utils/response', '../utils/pagination', '../utils/slugify', '../utils/activityLogger',
    '../middleware/auth', '../middleware/errorHandler', '../middleware/rateLimiter', '../middleware/upload', '../middleware/validate',
    '../validators/auth.validator', '../validators/category.validator', '../validators/product.validator', '../validators/shop.validator', '../validators/shopProduct.validator', '../validators/banner.validator', '../validators/setting.validator',
    '../repositories/admin.repository', '../repositories/category.repository', '../repositories/product.repository', '../repositories/shop.repository', '../repositories/shopProduct.repository', '../repositories/banner.repository', '../repositories/activityLog.repository', '../repositories/setting.repository',

    '../services/auth.service', '../services/category.service', '../services/product.service', '../services/shop.service', '../services/shopProduct.service', '../services/banner.service', '../services/admin.service', '../services/search.service',
    '../controllers/auth.controller', '../controllers/category.controller', '../controllers/product.controller', '../controllers/shop.controller', '../controllers/shopProduct.controller', '../controllers/banner.controller', '../controllers/admin.controller', '../controllers/search.controller',
    '../routes/index',
  ];

  let modulesLoaded = 0;
  modules.forEach((mod) => {
    try {
      require(mod);
      modulesLoaded++;
    } catch (e) {
      assert(false, `Module failed to load: ${mod}`, e.message);
    }
  });
  assert(modulesLoaded === modules.length, `All ${modules.length} Backend Architecture Modules Loaded Cleanly`);

  // 2. JWT Verification
  console.log('\n2️⃣ Verification Check: JWT Auth Token Issuance & Verification');
  const token = generateToken({ id: '507f1f77bcf86cd799439011', email: 'admin@nellaimart.com', role: ROLES.SUPER_ADMIN });
  assert(typeof token === 'string' && token.length > 20, 'JWT Token successfully generated');

  const decoded = verifyToken(token);
  assert(decoded && decoded.email === 'admin@nellaimart.com', 'JWT Token verified and payload decoded');

  // 3. Express Server Startup
  console.log('\n3️⃣ Verification Check: Server Startup');
  let server;
  await new Promise((resolve) => {
    server = app.listen(PORT, () => {
      assert(true, `Express HTTP Server successfully running on port ${PORT}`);
      resolve();
    });
  });

  // 4. Health Check Endpoint
  console.log('\n4️⃣ Verification Check: Health Check Endpoint');
  const healthRes = await makeRequest(opts('/api/v1/health'));
  assert(healthRes.statusCode === 200 && healthRes.body.success === true, 'GET /api/v1/health responded with 200 OK');

  // 5. Validation Middleware
  console.log('\n5️⃣ Verification Check: Validation Middleware');
  const badLogin = await makeRequest(opts('/api/v1/auth/login', 'POST'), { email: 'not-an-email', password: '123' });
  assert(badLogin.statusCode === 400 && badLogin.body.success === false, 'Validation Middleware correctly rejected malformed request (400 Bad Request)');

  // 6. JWT Auth Guard
  console.log('\n6️⃣ Verification Check: Auth Guard Middleware');
  const unauthRes = await makeRequest(opts('/api/v1/auth/profile'));
  assert(unauthRes.statusCode === 401 && unauthRes.body.success === false, 'Auth Guard correctly blocked unauthenticated request (401 Unauthorized)');

  // 7. Global Error Handler & 404 Catching
  console.log('\n7️⃣ Verification Check: Global Error Handler');
  const notFound = await makeRequest(opts('/api/v1/nonexistent-route-path'));
  assert(notFound.statusCode === 404 && notFound.body.success === false, 'Global 404 Handler caught unknown endpoint (404 Not Found)');

  server.close();

  console.log('\n==================================================');
  console.log(` ALL VERIFICATION CHECKS PASSED: ${passed} Passed, ${failed} Failed`);
  console.log('==================================================\n');

  process.exit(failed === 0 ? 0 : 1);
}

verifyBackend().catch((err) => {
  console.error('❌ Verification script crashed:', err);
  process.exit(1);
});
