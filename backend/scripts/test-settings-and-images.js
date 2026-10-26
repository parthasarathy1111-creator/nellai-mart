'use strict';

require('dotenv').config();
const http = require('http');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const app = require('../app');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Setting = require('../models/Setting');
const { generateToken } = require('../config/jwt');
const { ROLES } = require('../constants/roles');

const PORT = 5099;
let server;
let adminToken;
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

function makeRequest(options, postData, isMultipart = false, boundary = '') {
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
    if (postData) {
      if (Buffer.isBuffer(postData)) {
        req.write(postData);
      } else if (typeof postData === 'string') {
        req.write(postData);
      } else {
        req.write(JSON.stringify(postData));
      }
    }
    req.end();
  });
}

function opts(urlPath, method = 'GET', extraHeaders = {}) {
  return {
    hostname: 'localhost',
    port: PORT,
    path: urlPath,
    method,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  };
}

// Build multipart/form-data payload in pure Node without external packages
function buildMultipart(fields = {}, files = {}) {
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  const crlf = '\r\n';
  const parts = [];

  for (const [key, val] of Object.entries(fields)) {
    parts.push(Buffer.from(`--${boundary}${crlf}Content-Disposition: form-data; name="${key}"${crlf}${crlf}${val}${crlf}`));
  }

  for (const [fieldName, fileObj] of Object.entries(files)) {
    const filename = fileObj.filename || 'test.jpg';
    const contentType = fileObj.contentType || 'image/jpeg';
    const content = fileObj.content || Buffer.from('fake image content');

    parts.push(
      Buffer.from(
        `--${boundary}${crlf}Content-Disposition: form-data; name="${fieldName}"; filename="${filename}"${crlf}Content-Type: ${contentType}${crlf}${crlf}`
      )
    );
    parts.push(content);
    parts.push(Buffer.from(crlf));
  }

  parts.push(Buffer.from(`--${boundary}--${crlf}`));

  return {
    boundary,
    buffer: Buffer.concat(parts),
    headers: {
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
      'Content-Length': Buffer.concat(parts).length,
    },
  };
}

async function runIntegrationSuite() {
  console.log('\n======================================================');
  console.log('  NELLAI MART — SETTINGS & IMAGE MANAGEMENT TEST SUITE');
  console.log('======================================================\n');

  await connectDB();

  await new Promise((resolve) => {
    server = app.listen(PORT, () => {
      console.log(`🚀 Test Server started on port ${PORT}\n`);
      resolve();
    });
  });

  let admin = await Admin.findOne({ email: 'admin@nellaimart.com' });
  if (!admin) {
    const bcrypt = require('bcrypt');
    admin = await Admin.create({
      name: 'Nellai Mart Super Admin',
      email: 'admin@nellaimart.com',
      passwordHash: await bcrypt.hash('Admin@123456', 10),
      role: 'super_admin',
      isActive: true,
    });
  }

  adminToken = generateToken({
    id: admin._id,
    email: admin.email,
    role: admin.role,
  });


  // ─────────────────────────────────────────────────────────────
  // 1. SYSTEM SETTINGS TESTS
  // ─────────────────────────────────────────────────────────────
  console.log('1️⃣  TEST: System Settings Auth Guard');
  const unauthGet = await makeRequest(opts('/api/v1/admin/settings', 'GET'));
  assert(unauthGet.statusCode === 401, 'Unauthenticated GET /admin/settings blocked (401)');

  const unauthPut = await makeRequest(opts('/api/v1/admin/settings', 'PUT'), {
    platformName: 'Hacked',
  });
  assert(unauthPut.statusCode === 401, 'Unauthenticated PUT /admin/settings blocked (401)');

  console.log('\n2️⃣  TEST: System Settings Retrieval & Default Values');
  const authGet = await makeRequest(
    opts('/api/v1/admin/settings', 'GET', { Authorization: `Bearer ${adminToken}` })
  );
  assert(authGet.statusCode === 200, 'Authenticated GET /admin/settings returned 200 OK');
  assert(
    authGet.body.data && authGet.body.data.platformName,
    'Returned default or existing platform settings',
    authGet.body
  );

  console.log('\n3️⃣  TEST: System Settings Validation');
  // Invalid email
  const badEmailRes = await makeRequest(
    opts('/api/v1/admin/settings', 'PUT', { Authorization: `Bearer ${adminToken}` }),
    {
      platformName: 'Nellai Mart',
      contactEmail: 'not-an-email',
      contactPhone: '+91 98421 12345',
    }
  );
  assert(badEmailRes.statusCode === 400, 'Invalid email rejected with 400 Bad Request');

  // Invalid phone
  const badPhoneRes = await makeRequest(
    opts('/api/v1/admin/settings', 'PUT', { Authorization: `Bearer ${adminToken}` }),
    {
      platformName: 'Nellai Mart',
      contactEmail: 'support@nellaimart.com',
      contactPhone: '12345',
    }
  );
  assert(badPhoneRes.statusCode === 400, 'Invalid phone number rejected with 400 Bad Request');

  // Empty platform name
  const emptyNameRes = await makeRequest(
    opts('/api/v1/admin/settings', 'PUT', { Authorization: `Bearer ${adminToken}` }),
    {
      platformName: '   ',
      contactEmail: 'support@nellaimart.com',
      contactPhone: '+91 98421 12345',
    }
  );
  assert(emptyNameRes.statusCode === 400, 'Empty Platform Name rejected with 400 Bad Request');

  console.log('\n4️⃣  TEST: System Settings Persistence Flow');
  const updatedSettingsPayload = {
    platformName: 'Nellai Super Mart 2026',
    contactEmail: 'admin.support@nellaimart.org',
    contactPhone: '+91 98765 43210',
  };

  const saveRes = await makeRequest(
    opts('/api/v1/admin/settings', 'PUT', { Authorization: `Bearer ${adminToken}` }),
    updatedSettingsPayload
  );
  assert(saveRes.statusCode === 200, 'PUT /admin/settings returned 200 OK');
  assert(
    saveRes.body.data.platformName === updatedSettingsPayload.platformName &&
      saveRes.body.data.contactEmail === updatedSettingsPayload.contactEmail &&
      saveRes.body.data.contactPhone === updatedSettingsPayload.contactPhone,
    'Response payload reflects newly saved settings'
  );

  // Verify persistence in MongoDB by re-fetching
  const verifyGet = await makeRequest(
    opts('/api/v1/admin/settings', 'GET', { Authorization: `Bearer ${adminToken}` })
  );
  assert(verifyGet.statusCode === 200, 'Re-fetch GET /admin/settings succeeded');
  assert(
    verifyGet.body.data.contactEmail === updatedSettingsPayload.contactEmail,
    'Settings are correctly persisted in database and survive re-query'
  );

  // ─────────────────────────────────────────────────────────────
  // 2. IMAGE MANAGEMENT TESTS (CATEGORY & PRODUCT)
  // ─────────────────────────────────────────────────────────────
  console.log('\n5️⃣  TEST: Category Image Management (Add, Replace, Remove)');

  // A. Create Category with Image
  const dummyJpg = Buffer.from('FAKE_JPEG_IMAGE_BINARY_DATA');
  const catMultipart = buildMultipart(
    { name: 'Spices & Masala', icon: '🌶️', description: 'Fresh spices from Nellai' },
    { image: { filename: 'spices.jpg', contentType: 'image/jpeg', content: dummyJpg } }
  );

  const catCreateRes = await makeRequest(
    opts('/api/v1/categories', 'POST', {
      Authorization: `Bearer ${adminToken}`,
      ...catMultipart.headers,
    }),
    catMultipart.buffer
  );

  assert(catCreateRes.statusCode === 201, 'Category created with image upload (201 Created)');
  const createdCat = catCreateRes.body.data;
  assert(
    createdCat && createdCat.image && createdCat.image.length > 0,
    `Category image stored: ${createdCat?.image}`
  );

  // B. Replace Category Image
  const newCatJpg = Buffer.from('NEW_REPLACED_CATEGORY_IMAGE');
  const replaceMultipart = buildMultipart(
    { name: 'Spices & Masala Updated' },
    { image: { filename: 'new_spices.jpg', contentType: 'image/jpeg', content: newCatJpg } }
  );

  const catReplaceRes = await makeRequest(
    opts(`/api/v1/categories/${createdCat._id}`, 'PUT', {
      Authorization: `Bearer ${adminToken}`,
      ...replaceMultipart.headers,
    }),
    replaceMultipart.buffer
  );

  assert(catReplaceRes.statusCode === 200, 'Category image successfully replaced (200 OK)');
  const replacedCat = catReplaceRes.body.data;
  assert(
    replacedCat && replacedCat.image && replacedCat.image !== createdCat.image,
    `Category image updated to new location: ${replacedCat?.image}`
  );

  // C. Remove Category Image
  const removeCatMultipart = buildMultipart({
    name: 'Spices & Masala Updated',
    removeImage: 'true',
  });

  const catRemoveRes = await makeRequest(
    opts(`/api/v1/categories/${createdCat._id}`, 'PUT', {
      Authorization: `Bearer ${adminToken}`,
      ...removeCatMultipart.headers,
    }),
    removeCatMultipart.buffer
  );

  assert(catRemoveRes.statusCode === 200, 'Category image removed via removeImage flag');
  assert(
    catRemoveRes.body.data.image === '' || !catRemoveRes.body.data.image,
    'Category image reference cleared in DB'
  );

  console.log('\n6️⃣  TEST: Product Image Management (Add, Replace, Remove)');

  // A. Create Product with Image
  const prodJpg = Buffer.from('FAKE_PRODUCT_IMAGE_DATA');
  const prodMultipart = buildMultipart(
    {
      name: 'Nellai Special Sambar Powder',
      brand: 'Aachi',
      category: createdCat._id.toString(),
      unit: '500 g',
      description: 'Traditional Nellai style homemade sambar powder',
    },
    { image: { filename: 'sambar.jpg', contentType: 'image/jpeg', content: prodJpg } }
  );

  const prodCreateRes = await makeRequest(
    opts('/api/v1/products', 'POST', {
      Authorization: `Bearer ${adminToken}`,
      ...prodMultipart.headers,
    }),
    prodMultipart.buffer
  );

  assert(prodCreateRes.statusCode === 201, 'Product created with image upload (201 Created)');
  const createdProd = prodCreateRes.body.data;
  assert(
    createdProd && createdProd.images && createdProd.images.length > 0,
    `Product image saved in DB: ${createdProd?.images?.[0]?.url}`
  );

  // B. Replace Product Image
  const newProdJpg = Buffer.from('NEW_REPLACED_PRODUCT_IMAGE');
  const replaceProdMultipart = buildMultipart(
    {
      name: 'Nellai Special Sambar Powder',
      brand: 'Aachi Premium',
    },
    { image: { filename: 'sambar_new.jpg', contentType: 'image/jpeg', content: newProdJpg } }
  );

  const prodReplaceRes = await makeRequest(
    opts(`/api/v1/products/${createdProd._id}`, 'PUT', {
      Authorization: `Bearer ${adminToken}`,
      ...replaceProdMultipart.headers,
    }),
    replaceProdMultipart.buffer
  );

  assert(prodReplaceRes.statusCode === 200, 'Product image successfully replaced (200 OK)');
  const replacedProd = prodReplaceRes.body.data;
  assert(
    replacedProd && replacedProd.images && replacedProd.images[0]?.url !== createdProd.images[0]?.url,
    `Product image updated to new location: ${replacedProd?.images?.[0]?.url}`
  );

  // C. Remove Product Image
  const removeProdMultipart = buildMultipart({
    name: 'Nellai Special Sambar Powder',
    removeImage: 'true',
  });

  const prodRemoveRes = await makeRequest(
    opts(`/api/v1/products/${createdProd._id}`, 'PUT', {
      Authorization: `Bearer ${adminToken}`,
      ...removeProdMultipart.headers,
    }),
    removeProdMultipart.buffer
  );

  assert(prodRemoveRes.statusCode === 200, 'Product image removed via removeImage flag');
  assert(
    prodRemoveRes.body.data.images.length === 0,
    'Product images array cleared in DB upon removal'
  );

  // Cleanup created test records
  await Category.findByIdAndDelete(createdCat._id);
  await Product.findByIdAndDelete(createdProd._id);

  server.close();

  console.log('\n======================================================');
  console.log(` RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log('======================================================\n');

  process.exit(failed === 0 ? 0 : 1);
}

runIntegrationSuite().catch((err) => {
  console.error('❌ Test suite crashed:', err);
  if (server) server.close();
  process.exit(1);
});
