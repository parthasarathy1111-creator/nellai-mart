import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "../../components/common/Container";
import Breadcrumb from "../../components/common/Breadcrumb";
import ProductCard from "../../components/cards/ProductCard";
import { VerifiedBadge, OpenBadge } from "../../components/common/Badges";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { shopService } from "../../services/shopService";
import { productService } from "../../services/productService";

function Shop() {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [shopProducts, setShopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShopData() {
      setLoading(true);
      try {
        const shopData = await shopService.getShopById(id);
        setShop(shopData);

        if (shopData && Array.isArray(shopData.inventory) && shopData.inventory.length > 0) {
          const formattedInventory = shopData.inventory.map((sp) => {
            if (sp.product) {
              const formatted = productService.formatProduct ? productService.formatProduct(sp.product) : sp.product;
              return {
                ...formatted,
                price: sp.price ? `₹${sp.price}` : formatted.price,
                mrp: sp.mrp ? `₹${sp.mrp}` : formatted.mrp,
                stockStatus: sp.stockStatus === "IN_STOCK" ? "In Stock" : "Out of Stock",
              };
            }
            return null;
          }).filter(Boolean);
          setShopProducts(formattedInventory);
        } else {
          const allProds = await productService.getProducts();
          setShopProducts(allProds);
        }
      } catch (err) {
        console.error("Error loading shop details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadShopData();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <div className="py-20 flex justify-center">
          <LoadingSpinner label="Loading merchant details..." />
        </div>
      </Container>
    );
  }

  if (!shop) {
    return (
      <Container>
        <div className="py-16 text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Shop Not Found</h2>
          <p className="text-gray-600">The shop you are looking for is unavailable or unlisted.</p>
          <Link to="/search">
            <Button variant="primary">Browse All Merchants</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8 space-y-8">
        <Breadcrumb
          items={[
            { label: "Search", link: "/search" },
            { label: shop.name },
          ]}
        />

        {/* Shop Cover & Header Card */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-soft overflow-hidden">
          <div className="h-48 md:h-64 w-full bg-gray-100 relative">
            <img
              src={shop.image}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <OpenBadge isOpen={shop.isOpen} />
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">{shop.name}</h1>
                  {shop.verified && <VerifiedBadge text="Verified Merchant" />}
                </div>
                <p className="text-sm font-semibold text-green-700 mt-1">{shop.category}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <a href={`tel:${shop.phone}`}>
                  <Button variant="outline" size="md">
                    📞 Call Merchant
                  </Button>
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(shop.name + " " + shop.address)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="primary" size="md">
                    📍 Get Directions
                  </Button>
                </a>
              </div>
            </div>

            {/* Shop Details Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
              <div>
                <span className="font-bold text-gray-900 block">Address</span>
                <span>📍 {shop.address}</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 block">Operating Hours</span>
                <span>🕒 {shop.timing}</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 block">Merchant Owner</span>
                <span>👤 {shop.owner}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shop Inventory Catalog */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Store Inventory ({shopProducts.length} Items)</h2>
            <span className="text-xs text-gray-500 font-medium">Prices updated today</span>
          </div>

          {shopProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {shopProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 bg-white rounded-xl border border-gray-200 text-center text-gray-500">
              No active products currently listed for this shop.
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

export default Shop;