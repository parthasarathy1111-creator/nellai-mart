'use strict';

/**
 * Resolves an image URL so relative local uploads (/uploads/...) point to the backend host.
 * Absolute URLs (Cloudinary, Unsplash, HTTPS, blob previews, data URLs) are left untouched.
 *
 * @param {string} url - The raw image URL or relative path
 * @returns {string} Fully resolved image URL
 */
export function resolveImageUrl(url) {
  if (!url || typeof url !== 'string') return '';
  if (
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('data:') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
  const serverHost = apiBase.replace(/\/api\/v1\/?$/, '');
  return `${serverHost}${url.startsWith('/') ? '' : '/'}${url}`;
}
