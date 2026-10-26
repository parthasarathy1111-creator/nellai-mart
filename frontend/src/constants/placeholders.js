// Consistent SVG placeholder data URL for missing or broken images
export const DEFAULT_PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="none">
  <rect width="300" height="300" fill="#F3F4F6"/>
  <rect x="75" y="75" width="150" height="150" rx="16" fill="#E5E7EB"/>
  <path d="M110 170L135 140L160 165L185 130L210 170H110Z" fill="#9CA3AF"/>
  <circle cx="130" cy="120" r="12" fill="#9CA3AF"/>
  <text x="150" y="250" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#9CA3AF" text-anchor="middle">No Image Available</text>
</svg>
`);

export const CATEGORY_PLACEHOLDER_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300" fill="none">
  <rect width="300" height="300" fill="#ECFDF5"/>
  <rect x="75" y="75" width="150" height="150" rx="16" fill="#D1FAE5"/>
  <text x="150" y="165" font-family="system-ui, -apple-system, sans-serif" font-size="54" text-anchor="middle">📦</text>
  <text x="150" y="250" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#059669" text-anchor="middle">Category</text>
</svg>
`);
