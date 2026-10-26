import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";
import AdminHeader from "../admin/AdminHeader";
import Toast from "../common/Toast";

function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F9FAFB] text-[#111827]">
      {/* Admin Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Admin Content Canvas */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader onToggleSidebar={() => setIsSidebarOpen(true)} />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <Toast />
    </div>
  );
}

export default AdminLayout;
