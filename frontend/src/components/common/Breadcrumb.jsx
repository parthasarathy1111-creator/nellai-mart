import React from "react";
import { Link } from "react-router-dom";

function Breadcrumb({ items = [] }) {
  if (!items.length) return null;

  return (
    <nav className="flex items-center text-xs font-medium text-gray-500 py-2 overflow-x-auto" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 whitespace-nowrap">
        <li className="inline-flex items-center">
          <Link to="/" className="inline-flex items-center text-gray-500 hover:text-green-600">
            <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l1.293 1.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <svg className="w-4 h-4 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            {item.link ? (
              <Link to={item.link} className="text-gray-500 hover:text-green-600">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-800 font-semibold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
