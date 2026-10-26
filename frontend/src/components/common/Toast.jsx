import React from "react";
import { useToast } from "../../context/ToastContext";

function Toast() {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  const bgStyles = {
    success: "bg-green-800 text-white border-green-700",
    error: "bg-red-800 text-white border-red-700",
    info: "bg-blue-800 text-white border-blue-700",
    warning: "bg-amber-800 text-white border-amber-700",
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center justify-between p-4 rounded-lg border shadow-lg transition-all transform translate-y-0 ${
            bgStyles[toast.type] || bgStyles.success
          }`}
        >
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="ml-3 text-white/80 hover:text-white font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export default Toast;
