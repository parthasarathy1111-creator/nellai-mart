import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar({ initialQuery = "", onFilterClick, className = "" }) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/search");
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative flex items-center w-full ${className}`}>
      <div className="relative flex-1 flex items-center bg-white rounded-lg border-2 border-gray-200 focus-within:border-green-600 focus-within:ring-4 focus-within:ring-green-100 transition-all shadow-sm h-14">
        {/* Search Icon */}
        <div className="pl-4 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search rice, milk, oil, local shops..."
          className="w-full h-full px-3 text-base text-gray-900 bg-transparent placeholder-gray-400 focus:outline-hidden"
          aria-label="Search products and local shops"
        />

        {/* Integrated End-Adornment Filter Button */}
        {onFilterClick && (
          <button
            type="button"
            onClick={onFilterClick}
            className="flex items-center gap-1.5 px-3 py-1.5 mr-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
          </button>
        )}
      </div>

      {/* Primary Submit Button */}
      <button
        type="submit"
        className="ml-3 h-14 px-6 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-semibold rounded-lg transition-colors flex items-center justify-center shrink-0 shadow-sm cursor-pointer"
      >
        Search
      </button>
    </form>
  );
}

export default SearchBar;