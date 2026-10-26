import React from "react";
import { Link } from "react-router-dom";
import { VerifiedBadge, OpenBadge } from "../common/Badges";
import Button from "../common/Button";

function ShopCard({ shop }) {
  if (!shop) return null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between h-full">
      <div>
        {/* Cover / Header image */}
        <div className="relative h-36 w-full bg-gray-100 rounded-lg overflow-hidden mb-3">
          <img
            src={shop.image}
            alt={shop.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-2 right-2">
            <OpenBadge isOpen={shop.isOpen} />
          </div>
        </div>

        {/* Shop Name & Verified Badge */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <Link to={`/shop/${shop.id}`}>
            <h3 className="text-lg font-bold text-gray-900 hover:text-green-600 transition-colors">
              {shop.name}
            </h3>
          </Link>
          {shop.verified && <VerifiedBadge text="Verified" />}
        </div>

        {/* Category & Address */}
        <p className="text-xs font-medium text-green-700 mb-2">{shop.category}</p>
        <p className="text-sm text-gray-600 flex items-start gap-1 line-clamp-2 mb-3">
          <span>📍</span> {shop.address}
        </p>

        {/* Distance & Timing */}
        <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
          <span>🚶 {shop.distance || "Near you"}</span>
          <span>•</span>
          <span>🕒 {shop.timing || "8 AM - 9 PM"}</span>
        </div>
      </div>

      {/* Action Buttons: "Call" (Ghost style) and "Directions" (Solid Primary style) */}
      <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
        <a href={`tel:${shop.phone || "+919842112345"}`}>
          <Button variant="ghost" size="sm" fullWidth className="border border-gray-200">
            📞 Call
          </Button>
        </a>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(shop.name + " " + shop.address)}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="primary" size="sm" fullWidth>
            📍 Directions
          </Button>
        </a>
      </div>
    </div>
  );
}

export default ShopCard;
