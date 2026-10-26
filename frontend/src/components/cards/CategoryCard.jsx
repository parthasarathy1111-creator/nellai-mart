import React from "react";
import { Link } from "react-router-dom";

function CategoryCard({ category }) {
  if (!category) return null;

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group bg-white rounded-lg border border-gray-200 p-5 shadow-soft hover:shadow-soft-lg hover:border-green-300 transition-all duration-300 flex items-center gap-4 cursor-pointer"
    >
      <div className="w-12 h-12 rounded-lg bg-green-50 text-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
        {category.icon || "📦"}
      </div>
      <div>
        <h4 className="text-base font-bold text-gray-900 group-hover:text-green-600 transition-colors">
          {category.name}
        </h4>
        <p className="text-xs text-gray-500 font-medium">
          {category.count ? `${category.count}+ items` : "Explore items"}
        </p>
      </div>
    </Link>
  );
}

export default CategoryCard;
