import api from "./api";

export function formatShop(s) {
  if (!s) return null;
  return {
    id: s.slug || s._id || s.id,
    _id: s._id || s.id,
    name: s.name || "Local Shop",
    slug: s.slug || "shop",
    owner: s.ownerName || s.owner || "Merchant Owner",
    ownerName: s.ownerName || s.owner || "Merchant Owner",
    phone: s.phone || "+91 98765 43210",
    email: s.email || "",
    category: s.category || "General Stores",
    address: s.address || "Tirunelveli, Tamil Nadu",
    locality: s.locality || "Town",
    city: s.city || "Tirunelveli",
    rating: s.rating || 4.8,
    reviewsCount: s.reviewCount || s.reviewsCount || 180,
    distance: s.distance || "0.8 km",
    verified: s.isVerified ?? true,
    isVerified: s.isVerified ?? true,
    isOpen: s.isOpen ?? true,
    timing: s.timing || "8:00 AM - 9:30 PM",
    image: s.bannerAddress || s.logo || s.image || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80",
    bannerAddress: s.bannerAddress || "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=600&q=80",
    logo: s.logo || "",
    totalProducts: Array.isArray(s.inventory) ? s.inventory.length : (s.totalProducts || 240),
    joinedDate: s.createdAt ? s.createdAt.substring(0, 10) : "2024-01-15",
    status: s.status || "ACTIVE",
    isFeatured: s.isFeatured ?? false,
    inventory: Array.isArray(s.inventory) ? s.inventory : [],
  };
}

export const shopService = {
  getShops: async (params = {}) => {
    try {
      const res = await api.get("/shops", { params });
      const raw = Array.isArray(res.data) ? res.data : (res.data?.shops || []);
      return raw.map(formatShop);
    } catch (error) {
      console.error("Failed to fetch shops:", error);
      return [];
    }
  },

  getShopById: async (idOrSlug) => {
    try {
      const res = await api.get(`/shops/slug/${idOrSlug}`);
      return formatShop(res.data);
    } catch {
      try {
        const resById = await api.get(`/shops/${idOrSlug}`);
        return formatShop(resById.data);
      } catch (err) {
        console.error(`Failed to fetch shop (${idOrSlug}):`, err);
        return null;
      }
    }
  },

  createShop: async (formDataOrObject) => {
    const isFormData = formDataOrObject instanceof FormData;
    const headers = isFormData ? { "Content-Type": "multipart/form-data" } : {};
    const res = await api.post("/shops", formDataOrObject, { headers });
    return formatShop(res.data);
  },

  updateShop: async (id, formDataOrObject) => {
    const isFormData = formDataOrObject instanceof FormData;
    const headers = isFormData ? { "Content-Type": "multipart/form-data" } : {};
    const res = await api.put(`/shops/${id}`, formDataOrObject, { headers });
    return formatShop(res.data);
  },

  deleteShop: async (id) => {
    const res = await api.delete(`/shops/${id}`);
    return res;
  },
};
