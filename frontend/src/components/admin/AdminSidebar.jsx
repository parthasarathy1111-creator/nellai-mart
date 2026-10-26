import React from "react";
import { Link, useLocation } from "react-router-dom";

function AdminSidebar({ isOpen, onClose }) {
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Products", path: "/admin/products", icon: "📦" },
    { name: "Categories", path: "/admin/categories", icon: "🏷️" },
    { name: "Shops Directory", path: "/admin/shops", icon: "🏪" },
    { name: "Analytics & Reports", path: "/admin/reports", icon: "📈" },
    { name: "System Settings", path: "/admin/settings", icon: "⚙️" },
    { name: "Activity Logs", path: "/admin/activity-logs", icon: "📝" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-gray-900 text-gray-300 flex flex-col transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 bg-gray-950 border-b border-gray-800">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center text-white font-extrabold text-base">
              N
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-white leading-none">
                Nellai<span className="text-green-500">Mart</span>
              </span>
              <span className="text-[10px] font-semibold text-green-400 uppercase tracking-widest mt-0.5">
                Admin Console
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/admin" && location.pathname.startsWith(item.path));

            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-green-600 text-white shadow-xs"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Footer / Back to Public Site */}
        <div className="p-4 border-t border-gray-800 bg-gray-950">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-green-400 transition-colors"
          >
            <span>←</span> Back to Public Website
          </Link>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
