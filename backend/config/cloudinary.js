'use strict';

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const isCloudinaryConfigured = () => {
  const name = process.env.CLOUDINARY_CLOUD_NAME;
  const key = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  return (
    name &&
    name !== 'demo' &&
    name !== 'your_cloud_name' &&
    key &&
    key !== '123456789' &&
    key !== 'your_api_key' &&
    secret &&
    secret !== 'abcdefghijklmnopqrstuvwxyz' &&
    secret !== 'your_api_secret'
  );
};

const uploadsDir = path.resolve(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/**
 * Save image to local static uploads directory as fallback
 */
function saveToLocalStorage(buffer, originalname = 'image.jpg') {
  const ext = path.extname(originalname) || '.jpg';
  const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
  const filePath = path.join(uploadsDir, uniqueName);
  fs.writeFileSync(filePath, buffer);
  return {
    url: `/uploads/${uniqueName}`,
    publicId: `local:${uniqueName}`,
  };
}

/**
 * Upload a buffer, stream, or multer file to Cloudinary with local fallback.
 * @param {Buffer|Object} file - Buffer or Multer file object
 * @param {string} folder - Folder path
 * @returns {Promise<{url: string, publicId: string}>}
 */
async function uploadToCloudinary(file, folder = 'nellai-mart') {
  const buffer = file.buffer || (Buffer.isBuffer(file) ? file : null);
  const originalname = file.originalname || 'image.jpg';

  if (!buffer) {
    throw new Error('No valid image buffer provided for upload.');
  }

  // If Cloudinary is not configured with live credentials, use local storage
  if (!isCloudinaryConfigured()) {
    return saveToLocalStorage(buffer, originalname);
  }

  try {
    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      );
      uploadStream.end(buffer);
    });
  } catch (err) {
    console.warn(`⚠️ Cloudinary upload failed (${err.message}). Falling back to local static storage.`);
    return saveToLocalStorage(buffer, originalname);
  }
}

/**
 * Delete an image by public_id (supports Cloudinary and local files).
 * @param {string} publicId
 */
async function deleteFromCloudinary(publicId) {
  if (!publicId) return;

  try {
    if (typeof publicId === 'string' && publicId.startsWith('local:')) {
      const filename = publicId.replace('local:', '');
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return { result: 'ok' };
    }

    if (isCloudinaryConfigured()) {
      return await cloudinary.uploader.destroy(publicId);
    }
  } catch (err) {
    console.warn(`⚠️ Failed to delete image (${publicId}):`, err.message);
  }
}

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  uploadImage: uploadToCloudinary,
  deleteImage: deleteFromCloudinary,
};
