import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Summary */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center text-white font-bold text-lg">
                N
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Nellai<span className="text-green-500">Mart</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Hyperlocal discovery platform bridging Tirunelveli's trusted neighborhood merchants and everyday consumers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-green-400 transition-colors">Home</Link></li>
              <li><Link to="/search" className="hover:text-green-400 transition-colors">Find Products</Link></li>
              <li><Link to="/categories" className="hover:text-green-400 transition-colors">Categories</Link></li>
              <li><Link to="/about" className="hover:text-green-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-green-400 transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/category/groceries-staples" className="hover:text-green-400 transition-colors">Groceries & Rice</Link></li>
              <li><Link to="/category/fresh-produce" className="hover:text-green-400 transition-colors">Fresh Produce & Fruits</Link></li>
              <li><Link to="/category/dairy-milk" className="hover:text-green-400 transition-colors">Dairy & Milk</Link></li>
              <li><Link to="/category/spices-masalas" className="hover:text-green-400 transition-colors">Spices & Masalas</Link></li>
              <li><Link to="/category/snacks-sweets" className="hover:text-green-400 transition-colors">Tirunelveli Sweets</Link></li>
            </ul>
          </div>

          {/* Admin & Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Merchants & Admin</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link to="/admin/login" className="hover:text-green-400 transition-colors font-semibold text-green-400">Merchant Portal Login</Link></li>
              <li><Link to="/admin" className="hover:text-green-400 transition-colors">Admin Dashboard</Link></li>
              <li><Link to="/contact" className="hover:text-green-400 transition-colors">Register Your Shop</Link></li>
              <li className="pt-2 text-xs text-gray-500">📍 Tirunelveli, Tamil Nadu 627001</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Nellai Mart. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-400 cursor-pointer">Local Merchant Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;