import React, { useEffect, useState } from "react";
import StatsCard from "../../components/cards/StatsCard";
import DataTable from "../../components/common/DataTable";
import { StatusBadge } from "../../components/common/Badges";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { adminService } from "../../services/adminService";
import { productService } from "../../services/productService";
import { shopService } from "../../services/shopService";
import { Link } from "react-router-dom";

function Admin() {
  const [stats, setStats] = useState(null);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const [statsData, shopList] = await Promise.all([
          adminService.getDashboardStats(),
          shopService.getShops(),
        ]);
        setStats(statsData);
        setShops(shopList);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const columns = [
    { header: "Shop / Merchant", accessor: "name" },
    { header: "Category", accessor: "category" },
    { header: "Location", accessor: "address" },
    {
      header: "Status",
      render: (row) => <StatusBadge status={row.status || "ACTIVE"} />,
    },
    {
      header: "Actions",
      render: () => (
        <Link to={`/admin/shops`}>
          <Button variant="outline" size="sm">Manage</Button>
        </Link>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner label="Loading dashboard statistics..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-500">
            Real-time activity and catalog statistics across Tirunelveli region
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/products">
            <Button variant="primary" size="sm">
              + Add New Product
            </Button>
          </Link>
          <Link to="/admin/shops">
            <Button variant="outline" size="sm">
              + Verify Shop
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Products Listed"
          value={stats ? String(stats.totalProducts) : "0"}
          change="Live catalog"
          changeType="positive"
          icon="📦"
        />
        <StatsCard
          title="Registered Merchants"
          value={stats ? String(stats.totalShops) : "0"}
          change={`${stats?.activeShops || 0} active stores`}
          changeType="positive"
          icon="🏪"
        />
        <StatsCard
          title="Product Categories"
          value={stats ? String(stats.totalCategories) : "0"}
          change="Active classification"
          changeType="positive"
          icon="🏷️"
        />
        <StatsCard
          title="Verified Merchants"
          value={stats ? String(stats.verifiedShops) : "0"}
          change="Verified partners"
          changeType="positive"
          icon="✅"
        />
      </div>

      {/* Recent Merchants Data Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Local Merchant Registrations</h2>
          <Link to="/admin/shops" className="text-xs font-bold text-green-600 hover:underline">
            View All Merchants →
          </Link>
        </div>

        <DataTable columns={columns} data={shops} />
      </div>

      {/* Top Search Trends */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-soft space-y-4">
        <h3 className="text-base font-bold text-gray-900">Top Trending Searches in Tirunelveli</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-xs font-semibold text-gray-500 block">1. Boiled Rice (Ponni)</span>
            <span className="text-sm font-bold text-green-700">3,420 searches</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-xs font-semibold text-gray-500 block">2. Aavin Milk 500ml</span>
            <span className="text-sm font-bold text-green-700">2,890 searches</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-xs font-semibold text-gray-500 block">3. Sunflower Oil 1L</span>
            <span className="text-sm font-bold text-green-700">1,940 searches</span>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <span className="text-xs font-semibold text-gray-500 block">4. Iruttukadai Halwa</span>
            <span className="text-sm font-bold text-green-700">1,510 searches</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;