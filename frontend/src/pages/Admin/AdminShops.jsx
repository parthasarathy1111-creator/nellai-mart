import React, { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import Modal from "../../components/common/Modal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { VerifiedBadge, StatusBadge } from "../../components/common/Badges";
import { shopService } from "../../services/shopService";
import { useToast } from "../../context/ToastContext";

function AdminShops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShop, setEditingShop] = useState(null);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    phone: "",
    locality: "Town",
    category: "Groceries & Wholesale",
    address: "",
  });

  const fetchShops = async () => {
    setLoading(true);
    try {
      const data = await shopService.getShops();
      setShops(data);
    } catch (err) {
      console.error("Failed to load shops:", err);
      showToast("Error loading merchant directory", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const handleOpenCreate = () => {
    setEditingShop(null);
    setFormData({
      name: "",
      ownerName: "",
      phone: "",
      locality: "Town",
      category: "Groceries & Wholesale",
      address: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (shop) => {
    setEditingShop(shop);
    setFormData({
      name: shop.name || "",
      ownerName: shop.ownerName || shop.owner || "",
      phone: shop.phone || "",
      locality: shop.locality || "Town",
      category: shop.category || "Groceries & Wholesale",
      address: shop.address || "",
    });
    setIsModalOpen(true);
  };

  const handleToggleVerification = async (shop) => {
    try {
      const newStatus = !shop.verified;
      await shopService.updateShop(shop._id || shop.id, {
        isVerified: newStatus,
        status: newStatus ? "ACTIVE" : "PENDING_VERIFICATION",
      });
      showToast(`Merchant verification status updated for ${shop.name}`, "success");
      fetchShops();
    } catch (err) {
      showToast(err.message || "Failed to update verification status", "error");
    }
  };

  const handleSaveShop = async (e) => {
    if (e) e.preventDefault();
    if (!formData.name.trim() || !formData.ownerName.trim()) return;

    setSubmitting(true);
    try {
      if (editingShop) {
        await shopService.updateShop(editingShop._id || editingShop.id, formData);
        showToast("Shop details updated successfully", "success");
      } else {
        await shopService.createShop({
          ...formData,
          status: "ACTIVE",
          isVerified: true,
          isOpen: true,
        });
        showToast("New merchant registered successfully", "success");
      }
      setIsModalOpen(false);
      fetchShops();
    } catch (err) {
      showToast(err.message || "Failed to save shop profile", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteShop = async (id) => {
    if (!window.confirm("Are you sure you want to delete this merchant store?")) return;
    try {
      await shopService.deleteShop(id);
      showToast("Merchant shop removed successfully", "info");
      fetchShops();
    } catch (err) {
      showToast(err.message || "Failed to delete shop", "error");
    }
  };

  const columns = [
    {
      header: "Merchant Store Name",
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.image} alt={row.name} className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">{row.name}</span>
              {row.verified && <VerifiedBadge text="Verified" />}
            </div>
            <span className="text-xs text-gray-500">{row.ownerName || row.owner} • {row.phone}</span>
          </div>
        </div>
      ),
    },
    { header: "Category", accessor: "category" },
    { header: "Address Location", accessor: "address" },
    {
      header: "Status",
      render: (row) => <StatusBadge status={row.status || "ACTIVE"} />,
    },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant={row.verified ? "secondary" : "primary"}
            size="sm"
            onClick={() => handleToggleVerification(row)}
          >
            {row.verified ? "Revoke" : "Approve & Verify"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleOpenEdit(row)}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteShop(row._id || row.id)}>
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
          <h1 className="text-2xl font-bold text-gray-900">Local Shops Directory</h1>
          <p className="text-sm text-gray-500">Manage merchant verification and profile status in Tirunelveli</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate}>
          + Register New Shop
        </Button>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center"><LoadingSpinner label="Loading merchant directory..." /></div>
      ) : (
        <DataTable columns={columns} data={shops} />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingShop ? "Edit Merchant Shop Details" : "Register New Local Merchant Shop"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} disabled={submitting}>Cancel</Button>
            <Button variant="primary" onClick={handleSaveShop} disabled={submitting}>
              {submitting ? "Saving..." : editingShop ? "Update Shop" : "Register Shop"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveShop} className="space-y-4">
          <Input
            label="Shop Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Tirunelveli Fresh Mart"
          />
          <Input
            label="Owner Name"
            required
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            placeholder="Owner / Proprietor Name"
          />
          <Input
            label="Phone Number"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98421 00000"
          />
          <Input
            label="Locality"
            required
            value={formData.locality}
            onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
            placeholder="Town / Palayamkottai / Junction"
          />
          <Input
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="Supermarket / Groceries & Wholesale"
          />
          <Input
            label="Address"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Town High Road, Tirunelveli"
          />
        </form>
      </Modal>
    </div>
  );
}

export default AdminShops;
