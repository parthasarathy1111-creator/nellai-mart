import React from "react";

/**
 * A simple centered loading spinner with an optional label.
 */
function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8" role="status" aria-label={label}>
      <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin" />
      {label && <p className="text-sm text-gray-500 font-medium">{label}</p>}
    </div>
  );
}

export default LoadingSpinner;
