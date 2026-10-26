import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

function AdminHeader({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-hidden cursor-pointer"
          aria-label="Toggle Navigation Sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-sm font-bold text-gray-700 hidden sm:inline-block">
          📍 Platform Location: <span className="text-green-600 font-extrabold">Tirunelveli Region</span>
        </span>
      </div>

      {/* User Info & Actions */}
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-gray-200"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-bold text-gray-900 leading-none">{user.name}</span>
              <span className="text-xs text-gray-500">{user.role}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600 hover:bg-red-50 ml-2">
              Logout
            </Button>
          </div>
        ) : (
          <Button variant="primary" size="sm" onClick={() => navigate("/admin/login")}>
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}

export default AdminHeader;
