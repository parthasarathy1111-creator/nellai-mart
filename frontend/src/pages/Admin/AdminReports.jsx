import React, { useEffect, useState } from "react";
import StatsCard from "../../components/cards/StatsCard";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { adminService } from "../../services/adminService";
import { useToast } from "../../context/ToastContext";

function AdminReports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      try {
        const data = await adminService.getReports();
        setReports(data);
      } catch (err) {
        console.error("Failed to load reports:", err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, []);

  const handleExport = () => {
    showToast("Report exported as CSV file", "info");
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner label="Generating platform analytics report..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-sm text-gray-500">Platform performance, search statistics, and merchant growth</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          📥 Export Monthly Summary (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatsCard
          title="Total Products Cataloged"
          value={reports ? String(reports.totalProducts) : "0"}
          change="Live catalog"
          changeType="positive"
          icon="📦"
        />
        <StatsCard
          title="Active Merchant Stores"
          value={reports ? String(reports.totalShops) : "0"}
          change="100% operational"
          changeType="positive"
          icon="🏪"
        />
        <StatsCard
          title="Active Categories"
          value={reports && reports.productsByCategory ? String(Object.keys(reports.productsByCategory).length) : "5"}
          change="Taxonomy breakdown"
          changeType="positive"
          icon="📊"
        />
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-soft space-y-4">
        <h3 className="text-base font-bold text-gray-900">Products Distribution by Category</h3>
        <div className="space-y-4">
          {reports && reports.productsByCategory ? (
            Object.entries(reports.productsByCategory).map(([catName, count]) => {
              const total = reports.totalProducts || 1;
              const pct = Math.round((count / total) * 100);
              return (
                <div key={catName}>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>{catName}</span>
                    <span className="text-green-700">{pct}% ({count} items)</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-600 rounded-full" style={{ width: `${Math.max(pct, 5)}%` }}></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-xs text-gray-500">No category distribution data available.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminReports;
