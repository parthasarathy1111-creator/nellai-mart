'use strict';

const slugifyLib = require('slugify');

/**
 * Generate a URL-safe slug from a string.
 * Uses slugify with Tamil/unicode safe lower-case ASCII.
 * @param {string} text
 * @returns {string}
 */
function createSlug(text) {
  if (!text) return '';
  return slugifyLib(String(text), {
    lower: true,
    strict: true,
    trim: true,
  });
}

/**
 * Generate a unique slug by appending a suffix if needed.
 * @param {string} text
 * @param {Function} existsCheck - async fn(slug) => boolean
 * @returns {Promise<string>}
 */
async function createUniqueSlug(text, existsCheck) {
  let slug = createSlug(text);
  let suffix = 1;
  let candidate = slug;

  while (await existsCheck(candidate)) {
    candidate = `${slug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
}

// Support both `const generateSlug = require('../utils/slugify')` and `const { createSlug } = require('../utils/slugify')`
createSlug.createSlug = createSlug;
createSlug.generateSlug = createSlug;
createSlug.createUniqueSlug = createUniqueSlug;

module.exports = createSlug;
