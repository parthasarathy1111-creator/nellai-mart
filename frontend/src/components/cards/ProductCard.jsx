import React from "react";
import { Link } from "react-router-dom";

import { DEFAULT_PLACEHOLDER_IMAGE } from "../../constants/placeholders";

function ProductCard({ product }) {
  if (!product) return null;

  return (
    <div className="group bg-white rounded-lg border border-gray-200 p-4 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* Product Image - 1:1 Aspect Ratio, 8px radius */}
        <div className="relative aspect-square w-full bg-gray-50 rounded-lg overflow-hidden mb-3">
          <img
            src={product.image || DEFAULT_PLACEHOLDER_IMAGE}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = DEFAULT_PLACEHOLDER_IMAGE;
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {product.discount && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
              {product.discount}
            </span>
          )}
        </div>

        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span className="font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-md">
            {product.category}
          </span>
          {product.rating && (
            <span className="flex items-center gap-1 font-semibold text-amber-600">
              ★ {product.rating}
            </span>
          )}
        </div>

        {/* Product Title */}
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-base font-bold text-gray-900 line-clamp-2 hover:text-green-600 transition-colors">
            {product.name}
          </h3>
        </Link>
      </div>

      {/* Footer Details: Price & Nearby Shop Count */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <div>
          <div className="text-lg font-bold text-green-600 leading-none">
            {product.price}
          </div>
          {product.mrp && (
            <span className="text-xs text-gray-400 line-through">
              {product.mrp}
            </span>
          )}
        </div>

        {/* Shop Count Badge */}
        <Link
          to={`/product/${product.id}`}
          className="text-xs font-medium text-gray-600 bg-gray-100 hover:bg-green-50 hover:text-green-700 px-2.5 py-1.5 rounded-md transition-colors border border-gray-200"
        >
          {product.shopsCount ? `${product.shopsCount} Nearby Shops` : "Available Nearby"}
        </Link>
      </div>
    </div>
  );
}

export default ProductCard;
