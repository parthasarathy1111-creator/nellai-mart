import api from "./api";
import { resolveImageUrl } from "../utils/imageUrl";

function formatCategory(c) {
  if (!c) return null;
  return {
    id: c._id || c.id,
    _id: c._id || c.id,
    name: c.name || "Uncategorized",
    slug: c.slug || "uncategorized",
    icon: c.icon || "📦",
    image: resolveImageUrl(c.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80"),
    description: c.description || "",

    sortOrder: c.sortOrder ?? 0,
    isActive: c.isActive ?? true,
    count: c.count || 150,
  };
}

export const categoryService = {
  getCategories: async (params = {}) => {
    try {
      const res = await api.get("/categories", { params });
      const raw = Array.isArray(res.data) ? res.data : (res.data?.categories || []);
      return raw.map(formatCategory);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      return [];
    }
  },

  getCategoryBySlug: async (slug) => {
    try {
      const res = await api.get(`/categories/slug/${slug}`);
      return formatCategory(res.data);
    } catch (error) {
      console.error(`Failed to fetch category by slug (${slug}):`, error);
      return null;
    }
  },

  getCategoryById: async (id) => {
    try {
      const res = await api.get(`/categories/${id}`);
      return formatCategory(res.data);
    } catch (error) {
      console.error(`Failed to fetch category by id (${id}):`, error);
      return null;
    }
  },

  createCategory: async (formDataOrObject) => {
    const isFormData = formDataOrObject instanceof FormData;
    const headers = isFormData ? { "Content-Type": "multipart/form-data" } : {};
    const res = await api.post("/categories", formDataOrObject, { headers });
    return formatCategory(res.data);
  },

  updateCategory: async (id, formDataOrObject) => {
    const isFormData = formDataOrObject instanceof FormData;
    const headers = isFormData ? { "Content-Type": "multipart/form-data" } : {};
    const res = await api.put(`/categories/${id}`, formDataOrObject, { headers });
    return formatCategory(res.data);
  },

  deleteCategory: async (id) => {
    const res = await api.delete(`/categories/${id}`);
    return res;
  },
};
