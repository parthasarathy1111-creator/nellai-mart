import React from "react";
import Button from "./Button";

function EmptyState({
  title = "No results found",
  description = "We couldn't find anything matching your search query or filters.",
  actionLabel,
  onAction,
  icon,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-gray-200 shadow-xs my-6">
      <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4 text-2xl">
        {icon || "🔍"}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;
