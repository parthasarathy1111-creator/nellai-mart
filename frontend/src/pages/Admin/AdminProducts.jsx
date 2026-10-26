import React, { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ImageManager from "../../components/common/ImageManager";
import { productService } from "../../services/productService";
import { categoryService } from "../../services/categoryService";
import { useToast } from "../../context/ToastContext";
import { DEFAULT_PLACEHOLDER_IMAGE } from "../../constants/placeholders";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Image management state
  const [imageFile, setImageFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    unit: "1 kg",
    description: "",
  });

  const fetchProductsAndCategories = async () => {
    setLoading(true);
    try {
      const [prods, cats] = await Promise.all([
        productService.getProducts({ search }),
        categoryService.getCategories(),
      ]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error("Failed to load products/categories:", err);
      showToast("Error loading catalog data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, [search]);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setImageFile(null);
    setRemoveImage(false);
    setFormData({
      name: "",
      brand: "",
      category: categories[0]?._id || categories[0]?.id || "",
      unit: "1 kg",
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleEdit = (prod) => {
    setEditingProduct(prod);
    setImageFile(null);
    setRemoveImage(false);
    setFormData({
      name: prod.name || "",
      brand: prod.brand || "",
      category: prod.categoryId || (categories.find((c) => c.name === prod.category)?._id) || "",
      unit: prod.unit || "1 kg",
      description: prod.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Product title is required", "error");
      return;
    }

    setSubmitting(true);
    try {
      let payload;
      // If a new image file is chosen or image removal requested, use multipart/form-data
      if (imageFile || removeImage) {
        payload = new FormData();
        payload.append("name", formData.name.trim());
        payload.append("brand", formData.brand.trim());
        payload.append("category", formData.category || categories[0]?._id);
        payload.append("unit", formData.unit.trim());
        payload.append("description", formData.description.trim());
        if (imageFile) {
          payload.append("image", imageFile);
        }
        if (removeImage) {
          payload.append("removeImage", "true");
        }
      } else {
        payload = {
          name: formData.name.trim(),
          brand: formData.brand.trim(),
          category: formData.category || categories[0]?._id,
          unit: formData.unit.trim(),
          description: formData.description.trim(),
        };
      }

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id || editingProduct.id, payload);
        showToast("Product updated successfully", "success");
      } else {
        await productService.createProduct(payload);
        showToast("New product added to catalog", "success");
      }

      setIsModalOpen(false);
      setImageFile(null);
      setRemoveImage(false);
      fetchProductsAndCategories();
    } catch (err) {
      showToast(err.message || "Failed to save product", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await productService.deleteProduct(id);
      showToast("Product removed from catalog", "info");
      fetchProductsAndCategories();
    } catch (err) {
      showToast(err.message || "Failed to delete product", "error");
    }
  };

  const columns = [
    {
      header: "Product Item",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img
            src={row.image || DEFAULT_PLACEHOLDER_IMAGE}
            alt={row.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_PLACEHOLDER_IMAGE;
            }}
            className="w-10 h-10 rounded-lg object-cover border border-gray-200 bg-gray-50"
          />
          <div>
            <span className="font-bold text-gray-900 block">{row.name}</span>
            <span className="text-xs text-gray-500">{row.unit || "1 Unit"}</span>
          </div>
        </div>
      ),
    },
    { header: "Category", accessor: "category" },
    { header: "Price", accessor: "price" },
    { header: "Nearby Shops", accessor: "shopsCount" },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleEdit(row)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(row._id || row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Catalog Management</h1>
          <p className="text-sm text-gray-500">Manage global product listings available across Tirunelveli merchants</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate}>
          + Add New Product
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-xs flex items-center justify-between gap-4">
        <input
          type="text"
          placeholder="Filter by product title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md px-3.5 py-2 text-sm border border-gray-300 rounded-lg outline-hidden focus:border-green-600"
        />
        <span className="text-xs text-gray-500 font-semibold">{products.length} Products Listed</span>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="py-16 flex justify-center"><LoadingSpinner label="Loading product catalog..." /></div>
      ) : (
        <>
          <DataTable columns={columns} data={products} />
          <Pagination currentPage={1} totalPages={1} />
        </>
      )}

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? "Edit Product Item" : "Add New Product Item"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={submitting}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} disabled={submitting}>
              {submitting ? "Saving..." : editingProduct ? "Update Product" : "Save Product"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Product Title"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Ponni Boiled Rice 26kg"
          />

          {/* Reusable Image Management Component */}
          <ImageManager
            label="Product Image"
            currentImageUrl={editingProduct?.image || ""}
            onImageChange={(file, isRemoved) => {
              setImageFile(file);
              setRemoveImage(isRemoved);
            }}
            disabled={submitting}
          />

          <Input
            label="Brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            placeholder="e.g. Thamirabarani Gold"
          />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:border-green-600 outline-hidden"
            >
              {categories.map((c) => (
                <option key={c.id} value={c._id || c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Unit / Packaging"
            required
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="26 kg Bag / 1 L Pouch"
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Product details..."
          />
        </form>
      </Modal>
    </div>
  );
}

export default AdminProducts;
