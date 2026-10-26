import React, { useEffect, useState } from "react";
import Container from "../../components/common/Container";
import SearchBar from "../../components/common/SearchBar";
import CategoryCard from "../../components/cards/CategoryCard";
import ProductCard from "../../components/cards/ProductCard";
import ShopCard from "../../components/cards/ShopCard";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { POPULAR_SEARCHES } from "../../constants/popularSearches";
import { categoryService } from "../../services/categoryService";
import { productService } from "../../services/productService";
import { shopService } from "../../services/shopService";
import { Link } from "react-router-dom";

function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [cats, prods, shps] = await Promise.all([
          categoryService.getCategories(),
          productService.getProducts(),
          shopService.getShops(),
        ]);
        setCategories(cats);
        setProducts(prods);
        setShops(shps);
      } catch (err) {
        console.error("Error loading home page data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-12 md:space-y-16 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50/80 via-white to-gray-50/50 py-12 md:py-20 border-b border-gray-100">
        <Container>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
              📍 Hyperlocal Tirunelveli Commerce Platform
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Find Products from Nearby <span className="text-green-600">Local Shops</span>
            </h1>

            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Search thousands of daily essentials, groceries, produce, and local specialties available in your neighborhood stores right now.
            </p>

            {/* Oversized 56px SearchBar */}
            <div className="pt-4 max-w-2xl mx-auto">
              <SearchBar />
            </div>

            {/* Popular Search Chips */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Popular:</span>
              {POPULAR_SEARCHES.map((item) => (
                <Link
                  key={item}
                  to={`/search?q=${encodeURIComponent(item)}`}
                  className="px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-green-400 hover:text-green-700 hover:bg-green-50 transition-colors shadow-2xs font-medium text-gray-700"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Categories Grid */}
      <section>
        <Container>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Explore Categories</h2>
              <p className="text-sm text-gray-500">Find exactly what you need from local inventory</p>
            </div>
            <Link to="/categories">
              <Button variant="ghost" size="sm">
                View All Categories →
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center"><LoadingSpinner /></div>
          ) : categories.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No categories found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Featured Products */}
      <section>
        <Container>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Trending Nearby Products</h2>
              <p className="text-sm text-gray-500">Top-searched items in Tirunelveli stores</p>
            </div>
            <Link to="/search">
              <Button variant="ghost" size="sm">
                Browse Products →
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center"><LoadingSpinner /></div>
          ) : products.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No trending products available.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Verified Local Shops */}
      <section className="bg-gray-50 py-12 border-y border-gray-200">
        <Container>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Verified Local Merchants</h2>
              <p className="text-sm text-gray-500">Support your trusted local neighborhood stores</p>
            </div>
            <Link to="/search">
              <Button variant="ghost" size="sm">
                See All Merchants →
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center"><LoadingSpinner /></div>
          ) : shops.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No merchant stores found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {shops.slice(0, 3).map((shop) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Hyperlocal Trust Value Proposition */}
      <section>
        <Container>
          <div className="bg-green-900 text-white rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-lg">
            <div className="max-w-2xl relative z-10 space-y-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-800 text-green-300">
                Are you a store owner in Tirunelveli?
              </span>
              <h3 className="text-3xl font-extrabold tracking-tight">
                List Your Store Inventory on Nellai Mart Today
              </h3>
              <p className="text-green-100 text-base">
                Reach thousands of local buyers searching for daily products near Town, Palayamkottai, Vannarpettai, and Junction. Boost your foot traffic and sales.
              </p>
              <div className="pt-2 flex flex-wrap gap-4">
                <Link to="/admin/login">
                  <Button variant="accent" size="lg">
                    Merchant Sign In
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white/10">
                    Register New Shop
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

export default Home;