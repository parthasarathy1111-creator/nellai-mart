import React, { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ImageManager from "../../components/common/ImageManager";
import { categoryService } from "../../services/categoryService";
import { useToast } from "../../context/ToastContext";
import { CATEGORY_PLACEHOLDER_IMAGE } from "../../constants/placeholders";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Image management state
  const [imageFile, setImageFile] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  const [formData, setFormData] = useState({ name: "", icon: "📦", description: "" });
  const { showToast } = useToast();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
      showToast("Error loading categories", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setEditingCategory(null);
    setImageFile(null);
    setRemoveImage(false);
    setFormData({ name: "", icon: "📦", description: "" });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingId(category._id || category.id);
    setEditingCategory(category);
    setImageFile(null);
    setRemoveImage(false);
    setFormData({
      name: category.name || "",
      icon: category.icon || "📦",
      description: category.description || "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!formData.name.trim()) {
      showToast("Category name is required", "error");
      return;
    }

    setSubmitting(true);
    try {
      let payload;
      if (imageFile || removeImage) {
        payload = new FormData();
        payload.append("name", formData.name.trim());
        payload.append("icon", formData.icon || "📦");
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
          icon: formData.icon || "📦",
          description: formData.description.trim(),
        };
      }

      if (editingId) {
        await categoryService.updateCategory(editingId, payload);
        showToast("Category updated successfully", "success");
      } else {
        await categoryService.createCategory(payload);
        showToast("Category created successfully", "success");
      }

      setIsModalOpen(false);
      setImageFile(null);
      setRemoveImage(false);
      fetchCategories();
    } catch (err) {
      showToast(err.message || "Failed to save category", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      await categoryService.deleteCategory(id);
      showToast("Category deleted successfully", "success");
      fetchCategories();
    } catch (err) {
      showToast(err.message || "Failed to delete category", "error");
    }
  };

  const columns = [
    {
      header: "Category",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image ? (
            <img
              src={row.image}
              alt={row.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.style.display = "none";
                if (e.currentTarget.nextElementSibling) {
                  e.currentTarget.nextElementSibling.style.display = "flex";
                }
              }}
              className="w-10 h-10 rounded-lg object-cover border border-gray-200 bg-gray-50"
            />
          ) : null}
          <span
            className={`w-10 h-10 rounded-lg bg-green-50 items-center justify-center text-lg ${
              row.image ? "hidden" : "flex"
            }`}
          >
            {row.icon || "📦"}
          </span>
          <div>
            <span className="font-bold text-gray-900 block">{row.name}</span>
            <span className="text-xs text-gray-400">{row.slug}</span>
          </div>
        </div>
      ),
    },
    { header: "Slug Identifier", accessor: "slug" },
    { header: "Items Count", accessor: "count" },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleOpenEdit(row)}>Edit</Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800 hover:bg-red-50" onClick={() => handleDelete(row._id || row.id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Category Directory</h1>
          <p className="text-sm text-gray-500">Manage item taxonomy across local stores</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate}>
          + Add New Category
        </Button>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center"><LoadingSpinner label="Loading category taxonomy..." /></div>
      ) : (
        <DataTable columns={columns} data={categories} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? "Edit Category" : "Add New Category"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={submitting}>Cancel</Button>
            <Button variant="primary" onClick={handleSave} disabled={submitting}>
              {submitting ? "Saving..." : editingId ? "Update Category" : "Save Category"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Category Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Organic Produce"
          />

          {/* Reusable Image Management Component */}
          <ImageManager
            label="Category Image"
            currentImageUrl={editingCategory?.image || ""}
            onImageChange={(file, isRemoved) => {
              setImageFile(file);
              setRemoveImage(isRemoved);
            }}
            disabled={submitting}
            fallbackPlaceholder={CATEGORY_PLACEHOLDER_IMAGE}
          />

          <Input
            label="Emoji Icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="🥦"
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Category overview details..."
          />
        </form>
      </Modal>
    </div>
  );
}

export default AdminCategories;
