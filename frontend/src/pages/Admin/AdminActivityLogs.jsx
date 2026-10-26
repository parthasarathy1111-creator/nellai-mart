import React, { useEffect, useState } from "react";
import DataTable from "../../components/common/DataTable";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { adminService } from "../../services/adminService";

function AdminActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        const result = await adminService.getActivityLogs({ limit: 50 });
        setLogs(result.logs || []);
      } catch (err) {
        console.error("Failed to fetch activity logs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const columns = [
    { header: "Action Event", accessor: "action" },
    {
      header: "Target Entity",
      render: (row) => (
        <span className="text-sm text-gray-700">
          {row.target || row.entityType || "—"}
        </span>
      ),
    },
    {
      header: "Performed By",
      render: (row) => (
        <span className="text-sm font-medium text-gray-800">
          {row.admin?.name || row.adminName || "Admin User"}
        </span>
      ),
    },
    {
      header: "Timestamp",
      render: (row) => {
        const ts = row.createdAt || row.timestamp;
        if (!ts) return <span className="text-xs text-gray-400">—</span>;
        try {
          return (
            <span className="text-xs text-gray-600 whitespace-nowrap">
              {new Date(ts).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
          );
        } catch {
          return <span className="text-xs text-gray-600">{ts}</span>;
        }
      },
    },
    {
      header: "Module",
      render: (row) => (
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-green-50 text-green-700 border border-green-100">
          {row.module || "General"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Audit & Activity Logs</h1>
        <p className="text-sm text-gray-500">Timestamped record of administrator and merchant actions</p>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <LoadingSpinner label="Loading audit trail..." />
        </div>
      ) : logs.length === 0 ? (
        <div className="py-20 text-center">
          <div className="text-4xl mb-3">📋</div>
          <p className="text-gray-500 text-sm font-medium">No activity logs found.</p>
          <p className="text-gray-400 text-xs mt-1">Admin actions will appear here after they are performed.</p>
        </div>
      ) : (
        <DataTable columns={columns} data={logs} />
      )}
    </div>
  );
}

export default AdminActivityLogs;
