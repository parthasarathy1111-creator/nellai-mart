import React from "react";
import Button from "./Button";

function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while loading this section. Please try again.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50/50 rounded-xl border border-red-200 my-6">
      <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3 text-xl font-bold">
        ⚠️
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 max-w-sm mb-4">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          Try Again
        </Button>
      )}
    </div>
  );
}

export default ErrorState;
