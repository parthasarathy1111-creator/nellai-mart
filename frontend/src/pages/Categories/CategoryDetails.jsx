import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from "../../components/common/Container";
import Breadcrumb from "../../components/common/Breadcrumb";
import ProductCard from "../../components/cards/ProductCard";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { categoryService } from "../../services/categoryService";
import { productService } from "../../services/productService";

function CategoryDetails() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategoryData() {
      setLoading(true);
      try {
        const cat = await categoryService.getCategoryBySlug(id);
        const catObj = cat || { name: id.replace(/-/g, " ").toUpperCase(), slug: id, icon: "📦" };
        setCategory(catObj);

        const prods = await productService.getProducts({ category: cat?._id || id });
        if (prods.length > 0) {
          setProducts(prods);
        } else {
          const searchProds = await productService.searchProducts("", id);
          setProducts(searchProds);
        }
      } catch (err) {
        console.error("Error loading category details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryData();
  }, [id]);

  if (loading) {
    return (
      <Container>
        <div className="py-20 flex justify-center">
          <LoadingSpinner label="Loading category items..." />
        </div>
      </Container>
    );
  }

  if (!category) return null;

  return (
    <Container>
      <div className="py-8 space-y-6">
        <Breadcrumb
          items={[
            { label: "Categories", link: "/categories" },
            { label: category.name },
          ]}
        />

        <div className="bg-green-50 rounded-xl p-8 border border-green-100 flex items-center gap-6">
          <div className="w-16 h-16 rounded-xl bg-white overflow-hidden shadow-xs shrink-0 flex items-center justify-center border border-green-200">
            {category.image ? (
              <img
                src={category.image}
                alt={category.name}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  if (e.currentTarget.nextElementSibling) {
                    e.currentTarget.nextElementSibling.style.display = "flex";
                  }
                }}
                className="w-full h-full object-cover"
              />
            ) : null}
            <span className={`text-3xl ${category.image ? "hidden" : "flex"}`}>
              {category.icon || "📦"}
            </span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
            <p className="text-gray-600 mt-1">
              {products.length} products available in Tirunelveli local stores
            </p>
          </div>
        </div>


        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No items in this category yet"
            description="Local shops are updating their inventory. Check back soon!"
          />
        )}
      </div>
    </Container>
  );
}

export default CategoryDetails;
