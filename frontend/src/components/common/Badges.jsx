import React from "react";

export function VerifiedBadge({ text = "Verified Shop", className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200 ${className}`}>
      <svg className="w-3.5 h-3.5 text-green-600 fill-current" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
      {text}
    </span>
  );
}

export function OpenBadge({ isOpen = true, textOpen = "Open Now", textClosed = "Closed" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isOpen ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-gray-100 text-gray-600 border border-gray-200"}`}>
      <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}></span>
      {isOpen ? textOpen : textClosed}
    </span>
  );
}

export function PopularBadge({ text = "Popular" }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
      ⚡ {text}
    </span>
  );
}

export function StatusBadge({ status = "Active" }) {
  const styles = {
    Active: "bg-green-100 text-green-800 border-green-200",
    Pending: "bg-amber-100 text-amber-800 border-amber-200",
    Inactive: "bg-gray-100 text-gray-700 border-gray-200",
    Suspended: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.Active}`}>
      {status}
    </span>
  );
}
