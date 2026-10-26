import React, { useEffect, useState } from "react";
import Container from "../../components/common/Container";
import Breadcrumb from "../../components/common/Breadcrumb";
import CategoryCard from "../../components/cards/CategoryCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { categoryService } from "../../services/categoryService";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCats() {
      setLoading(true);
      try {
        const data = await categoryService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCats();
  }, []);

  return (
    <Container>
      <div className="py-8 space-y-6">
        <Breadcrumb items={[{ label: "Categories" }]} />

        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Product Categories</h1>
          <p className="text-gray-600 mt-1">
            Browse items by category across Tirunelveli local stores
          </p>
        </div>

        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner label="Loading categories..." />
          </div>
        ) : categories.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No categories found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

export default Categories;
