import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Toast from "../common/Toast";
import { Outlet } from "react-router-dom";

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#111827]">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <Toast />
    </div>
  );
}

export default PublicLayout;
