import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "../../components/common/Container";
import Breadcrumb from "../../components/common/Breadcrumb";
import ProductCard from "../../components/cards/ProductCard";
import { VerifiedBadge } from "../../components/common/Badges";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { productService } from "../../services/productService";

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      try {
        const prod = await productService.getProductById(id);
        setProduct(prod);
        if (prod) {
          const all = await productService.getProducts();
          setRelatedProducts(all.filter((p) => p.id !== prod.id && p._id !== prod._id).slice(0, 4));
        }
      } catch (err) {
        console.error("Error loading product details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProductData();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <div className="py-20 flex justify-center">
          <LoadingSpinner label="Loading product details..." />
        </div>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container>
        <div className="py-16 text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Product Not Found</h2>
          <p className="text-gray-600">The product you are looking for is unavailable or removed.</p>
          <Link to="/search">
            <Button variant="primary">Browse All Products</Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-8 space-y-10">
        <Breadcrumb
          items={[
            { label: "Search", link: "/search" },
            { label: product.category, link: `/category/${product.categorySlug}` },
            { label: product.name },
          ]}
        />

        {/* Product Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-soft">
          {/* Main Product Image */}
          <div className="aspect-square w-full bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center">
            <img
              src={product.image || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%239CA3AF' viewBox='0 0 24 24'><path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/></svg>"}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%239CA3AF' viewBox='0 0 24 24'><path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/></svg>";
              }}
              className="w-full h-full object-cover"
            />
          </div>


          {/* Product Details */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-200">
                  {product.category}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  ✓ {product.stockStatus || "In Stock"}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                {product.name}
              </h1>

              {/* Price & Rating */}
              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-3xl font-black text-green-600">{product.price}</span>
                {product.mrp && <span className="text-sm text-gray-400 line-through">{product.mrp}</span>}
                {product.unit && <span className="text-sm text-gray-500 font-medium">/ {product.unit}</span>}
              </div>

              <p className="text-sm text-gray-600 leading-relaxed pt-2">
                {product.description}
              </p>
            </div>

            {/* Availability Summary */}
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-gray-700">Available in Nearby Shops:</span>
                <span className="font-bold text-green-700">{product.nearbyShops && product.nearbyShops.length > 0 ? product.nearbyShops.length : 1} Shops</span>
              </div>
              <p className="text-xs text-gray-500">
                Compare local shop prices below and visit or call directly for immediate pickup.
              </p>
            </div>
          </div>
        </div>

        {/* Nearby Local Shops Stocking This Product */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Nearby Shops Selling This Product</h2>
            <p className="text-sm text-gray-500">Compare prices and visit your nearest local store in Tirunelveli</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-soft overflow-hidden">
            {product.nearbyShops && product.nearbyShops.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {product.nearbyShops.map((shop) => (
                  <div key={shop.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/80 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link to={`/shop/${shop.id}`} className="text-base font-bold text-gray-900 hover:text-green-600">
                          {shop.name}
                        </Link>
                        {shop.verified && <VerifiedBadge text="Verified" />}
                      </div>
                      <p className="text-xs text-gray-600">📍 {shop.location} • <span className="font-semibold text-gray-800">{shop.distance}</span></p>
                    </div>

                    <div className="flex items-center gap-6 justify-between sm:justify-end">
                      <div className="text-right">
                        <span className="text-lg font-bold text-green-600">{shop.price}</span>
                        <p className="text-[11px] text-emerald-600 font-semibold">In Stock</p>
                      </div>

                      <div className="flex gap-2">
                        <a href="tel:+919842112345">
                          <Button variant="outline" size="sm">📞 Call</Button>
                        </a>
                        <a href={`https://maps.google.com/?q=${encodeURIComponent(shop.name + " " + shop.location)}`} target="_blank" rel="noreferrer">
                          <Button variant="primary" size="sm">📍 Directions</Button>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 text-sm">
                In-store stock details are being updated for this item.
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-bold text-gray-900">Similar Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

export default Product;