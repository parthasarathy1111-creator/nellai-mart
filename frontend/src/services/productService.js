import api from "./api";
import { resolveImageUrl } from "../utils/imageUrl";

export function formatProduct(p) {
  if (!p) return null;

  // Extract clean URLs from string or { url, publicId } objects
  let rawImages = [];
  if (Array.isArray(p.images) && p.images.length > 0) {
    rawImages = p.images
      .map((img) => (typeof img === "object" && img !== null ? img.url : img))
      .filter(Boolean)
      .map(resolveImageUrl);
  } else if (p.image) {
    const single = typeof p.image === "object" ? p.image.url : p.image;
    if (single) rawImages = [resolveImageUrl(single)];
  }

  const primaryImage = rawImages[0] || "";


  const categoryName = typeof p.category === "object" ? p.category?.name : (p.category || "Groceries");
  const categorySlug = typeof p.category === "object" ? p.category?.slug : "groceries";

  const numPrice = typeof p.price === "number" ? p.price : parseFloat(String(p.price || "0").replace(/[^0-9.]/g, ""));
  const numMrp = typeof p.mrp === "number" ? p.mrp : parseFloat(String(p.mrp || "0").replace(/[^0-9.]/g, ""));

  let discountStr = p.discount || p.discountText || "";
  if (!discountStr && numMrp > numPrice && numPrice > 0) {
    const pct = Math.round(((numMrp - numPrice) / numMrp) * 100);
    if (pct > 0) discountStr = `${pct}% OFF`;
  }

  const nearbyShops = (p.availableShops || []).map((sp) => ({
    id: sp.shop?._id || sp.shop?.id || sp.shop,
    name: sp.shop?.name || "Local Merchant",
    location: sp.shop?.locality || sp.shop?.address || "Tirunelveli",
    price: sp.price ? `₹${sp.price}` : "Best Price",
    mrp: sp.mrp ? `₹${sp.mrp}` : "",
    distance: "1.0 km",
    verified: sp.shop?.isVerified ?? true,
    inStock: sp.stockStatus !== "OUT_OF_STOCK" && sp.isAvailable !== false,
  }));

  return {
    id: p.slug || p._id || p.id,
    _id: p._id || p.id,
    name: p.name || "Product",
    slug: p.slug || "product",
    brand: p.brand || "",
    category: categoryName,
    categorySlug,
    categoryId: typeof p.category === "object" ? p.category?._id : p.category,
    price: numPrice > 0 ? `₹${numPrice}` : "₹180",
    rawPrice: numPrice,
    mrp: numMrp > 0 ? `₹${numMrp}` : "",
    rawMrp: numMrp,
    discount: discountStr,
    rating: p.rating || 4.8,
    reviewsCount: p.reviewsCount || p.reviewCount || 120,
    image: primaryImage,
    images: rawImages,

    shopsCount: nearbyShops.length > 0 ? nearbyShops.length : (p.shopsCount || 5),
    description: p.description || "Fresh high-quality product available across local neighborhood stores in Tirunelveli.",
    stockStatus: p.stockStatus || "In Stock",
    unit: p.unit || "1 Pack",
    tags: Array.isArray(p.tags) ? p.tags : [],
    isFeatured: p.isFeatured ?? false,
    isActive: p.isActive ?? true,
    nearbyShops,
  };
}

export const productService = {
  getProducts: async (params = {}) => {
    try {
      const res = await api.get("/products", { params });
      const raw = Array.isArray(res.data) ? res.data : (res.data?.products || []);
      return raw.map(formatProduct);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return [];
    }
  },

  getProductById: async (idOrSlug) => {
    try {
      const res = await api.get(`/products/slug/${idOrSlug}`);
      return formatProduct(res.data);
    } catch {
      try {
        const resById = await api.get(`/products/${idOrSlug}`);
        return formatProduct(resById.data);
      } catch (err) {
        console.error(`Failed to fetch product (${idOrSlug}):`, err);
        return null;
      }
    }
  },

  searchProducts: async (query, category, minPrice, maxPrice) => {
    try {
      const params = {};
      if (query) params.q = query;
      if (category) params.category = category;

      const res = await api.get("/search", { params });
      if (res.data && Array.isArray(res.data.products)) {
        let results = res.data.products.map(formatProduct);
        if (minPrice) results = results.filter((p) => p.rawPrice >= parseFloat(minPrice));
        if (maxPrice) results = results.filter((p) => p.rawPrice <= parseFloat(maxPrice));
        return results;
      }

      // Fallback search via /products
      const prodRes = await api.get("/products", { params: { search: query, category } });
      const raw = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.products || []);
      let results = raw.map(formatProduct);
      if (minPrice) results = results.filter((p) => p.rawPrice >= parseFloat(minPrice));
      if (maxPrice) results = results.filter((p) => p.rawPrice <= parseFloat(maxPrice));
      return results;
    } catch (error) {
      console.error("Search failed:", error);
      return [];
    }
  },

  createProduct: async (formDataOrObject) => {
    const isFormData = formDataOrObject instanceof FormData;
    const headers = isFormData ? { "Content-Type": "multipart/form-data" } : {};
    const res = await api.post("/products", formDataOrObject, { headers });
    return formatProduct(res.data);
  },

  updateProduct: async (id, formDataOrObject) => {
    const isFormData = formDataOrObject instanceof FormData;
    const headers = isFormData ? { "Content-Type": "multipart/form-data" } : {};
    const res = await api.put(`/products/${id}`, formDataOrObject, { headers });
    return formatProduct(res.data);
  },

  deleteProduct: async (id) => {
    const res = await api.delete(`/products/${id}`);
    return res;
  },
};
