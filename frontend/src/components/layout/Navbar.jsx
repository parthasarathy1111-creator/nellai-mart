import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "../common/Button";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useState("Tirunelveli Town");
  const currentPath = useLocation().pathname;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Search", path: "/search" },
    { name: "Categories", path: "/categories" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Locality Picker */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-decoration-none">
              <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center text-white font-extrabold text-xl shadow-xs">
                N
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">
                Nellai<span className="text-green-600">Mart</span>
              </span>
            </Link>

            {/* Locality Selector Dropdown */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700">
              <span className="text-green-600">📍</span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="bg-transparent text-gray-800 font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value="Tirunelveli Town">Tirunelveli Town</option>
                <option value="Palayamkottai">Palayamkottai</option>
                <option value="Vannarpettai">Vannarpettai</option>
                <option value="Junction">Tirunelveli Junction</option>
              </select>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-semibold transition-colors ${
                  currentPath === link.path
                    ? "text-green-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Admin CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <Link to="/admin/login" className="hidden sm:block">
              <Button variant="outline" size="sm">
                Admin Portal
              </Button>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 focus:outline-hidden cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="px-2 py-1.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-700 mb-2">
            📍 Current Area: <span className="font-bold text-green-700">{location}</span>
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-semibold ${
                currentPath === link.path
                  ? "bg-green-50 text-green-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-2 border-t border-gray-100">
            <Link to="/admin/login" onClick={() => setIsMobileMenuOpen(false)}>
              <Button variant="primary" fullWidth size="md">
                Admin Portal Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;