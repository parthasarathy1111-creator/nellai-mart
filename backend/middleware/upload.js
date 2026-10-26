'use strict';

const multer = require('multer');
const { uploadImage } = require('../config/cloudinary');
const { sendError } = require('../utils/response');

// Store files in memory before uploading to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB per file
    files: 5,
  },
});

function singleUpload(fieldName) {
  return upload.single(fieldName);
}

function arrayUpload(fieldName, maxCount = 5) {
  return upload.array(fieldName, maxCount);
}

function fieldsUpload(fieldsArray) {
  return upload.fields(fieldsArray);
}

function uploadSingleImage(fieldName, folder = 'nellai-mart') {
  return [
    upload.single(fieldName),
    async (req, res, next) => {
      if (!req.file) return next();

      try {
        const result = await uploadImage(req.file, folder);
        req.uploadedImage = result;
        next();
      } catch (err) {
        return sendError(res, 500, 'Image upload failed.', [
          { message: err.message },
        ]);
      }
    },
  ];
}

function uploadMultipleImages(fieldName, maxCount = 5, folder = 'nellai-mart') {
  return [
    upload.array(fieldName, maxCount),
    async (req, res, next) => {
      if (!req.files || req.files.length === 0) return next();

      try {
        const results = await Promise.all(
          req.files.map((file) => uploadImage(file, folder))
        );
        req.uploadedImages = results;
        next();
      } catch (err) {
        return sendError(res, 500, 'Image upload failed.', [
          { message: err.message },
        ]);
      }
    },
  ];
}

module.exports = {
  upload,
  singleUpload,
  arrayUpload,
  fieldsUpload,
  uploadSingleImage,
  uploadMultipleImages,
};
