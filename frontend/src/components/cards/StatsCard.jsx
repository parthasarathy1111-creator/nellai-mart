import React from "react";

function StatsCard({ title, value, change, changeType = "positive", icon }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-soft hover:shadow-soft-lg transition-all duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="w-9 h-9 rounded-lg bg-green-50 text-green-700 flex items-center justify-center text-lg">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline justify-between">
        <div className="text-3xl font-bold text-gray-900 tracking-tight">
          {value}
        </div>
        {change && (
          <span
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
              changeType === "positive"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {changeType === "positive" ? "↑" : "↓"} {change}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatsCard;
