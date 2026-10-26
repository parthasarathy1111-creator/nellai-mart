import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Container from "../../components/common/Container";
import SearchBar from "../../components/common/SearchBar";
import ProductCard from "../../components/cards/ProductCard";
import ShopCard from "../../components/cards/ShopCard";
import Pagination from "../../components/common/Pagination";
import EmptyState from "../../components/common/EmptyState";
import Breadcrumb from "../../components/common/Breadcrumb";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { productService } from "../../services/productService";
import { shopService } from "../../services/shopService";
import { categoryService } from "../../services/categoryService";

function Search() {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";

  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryService.getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    async function performSearch() {
      setLoading(true);
      try {
        const [prodList, shopList] = await Promise.all([
          productService.searchProducts(queryParam, selectedCategory),
          shopService.getShops({ search: queryParam, category: selectedCategory, isVerified: onlyVerified ? true : undefined }),
        ]);
        setProducts(prodList);
        setShops(onlyVerified ? shopList.filter((s) => s.verified || s.isVerified) : shopList);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }
    performSearch();
  }, [queryParam, selectedCategory, onlyVerified]);

  return (
    <Container>
      <div className="py-6 space-y-6">
        <Breadcrumb items={[{ label: "Search Results" }]} />

        {/* Search Header */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {queryParam ? `Search Results for "${queryParam}"` : "All Products & Local Merchants"}
              </h1>
              <p className="text-sm text-gray-500">
                Showing matching inventory from Tirunelveli local stores
              </p>
            </div>

            {/* Mobile Filter Toggle */}
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            >
              ⚙️ Filters
            </Button>
          </div>

          <SearchBar initialQuery={queryParam} />
        </div>

        {/* Tab Selection: Products vs Shops */}
        <div className="flex items-center justify-between border-b border-gray-200 pt-2">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab("products")}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "products"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Products ({products.length})
            </button>
            <button
              onClick={() => setActiveTab("shops")}
              className={`pb-3 text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                activeTab === "shops"
                  ? "border-green-600 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-900"
              }`}
            >
              Local Shops ({shops.length})
            </button>
          </div>

          <span className="text-xs text-gray-500 hidden sm:inline-block">
            Sorted by relevance & location proximity
          </span>
        </div>

        {/* Main Grid & Filter Sidebar Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
          {/* Filters Sidebar */}
          <aside className={`md:block space-y-6 bg-white p-5 rounded-lg border border-gray-200 ${showFilterDrawer ? "block" : "hidden"}`}>
            <div>
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                Categories
              </h3>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => setSelectedCategory("")}
                  className={`block w-full text-left px-2.5 py-1.5 rounded-md ${
                    selectedCategory === "" ? "bg-green-50 text-green-700 font-bold" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`block w-full text-left px-2.5 py-1.5 rounded-md ${
                      selectedCategory === cat.slug ? "bg-green-50 text-green-700 font-bold" : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">
                Shop Type
              </h3>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={(e) => setOnlyVerified(e.target.checked)}
                  className="rounded-xs text-green-600 focus:ring-green-500"
                />
                Show Verified Shops Only
              </label>
            </div>
          </aside>

          {/* Results Area */}
          <div className="md:col-span-3">
            {loading ? (
              <div className="py-16 flex justify-center">
                <LoadingSpinner label="Searching Tirunelveli merchants..." />
              </div>
            ) : activeTab === "products" ? (
              products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  <Pagination currentPage={1} totalPages={1} />
                </>
              ) : (
                <EmptyState
                  title="No products matched your search"
                  description="Try adjusting your keywords or category filters."
                  actionLabel="Clear Filters"
                  onAction={() => {
                    setSelectedCategory("");
                    setOnlyVerified(false);
                  }}
                />
              )
            ) : shops.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {shops.map((shop) => (
                    <ShopCard key={shop.id} shop={shop} />
                  ))}
                </div>
                <Pagination currentPage={1} totalPages={1} />
              </>
            ) : (
              <EmptyState
                title="No local shops matched your search"
                description="We couldn't find any merchant matching the selected filters."
                actionLabel="Reset Search"
                onAction={() => {
                  setSelectedCategory("");
                  setOnlyVerified(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Search;