import React from "react";

export function Skeleton({ className = "" }) {
  return <div className={`animate-pulse bg-gray-200 rounded-md ${className}`}></div>;
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <Skeleton className="h-40 w-full rounded-md" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="w-full bg-white rounded-lg border border-gray-200 p-4 space-y-3">
      <Skeleton className="h-8 w-full rounded-md" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full" />
      ))}
    </div>
  );
}
