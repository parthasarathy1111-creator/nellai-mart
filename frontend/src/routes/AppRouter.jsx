import React from "react";
import { createBrowserRouter } from "react-router-dom";

// Layouts
import PublicLayout from "../components/layout/PublicLayout";
import AdminLayout from "../components/layout/AdminLayout";

// Public Pages
import Home from "../pages/Home/Home";
import Search from "../pages/search/Search";
import Categories from "../pages/Categories/Categories";
import CategoryDetails from "../pages/Categories/CategoryDetails";
import Product from "../pages/Product/Product";
import Shop from "../pages/Shop/Shop";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import NotFound from "../pages/NotFound/NotFound";

// Admin Pages
import AdminLogin from "../pages/Admin/AdminLogin";
import Admin from "../pages/Admin/Admin";
import AdminProducts from "../pages/Admin/AdminProducts";
import AdminCategories from "../pages/Admin/AdminCategories";
import AdminShops from "../pages/Admin/AdminShops";
import AdminReports from "../pages/Admin/AdminReports";
import AdminSettings from "../pages/Admin/AdminSettings";
import AdminActivityLogs from "../pages/Admin/AdminActivityLogs";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "search", element: <Search /> },
      { path: "categories", element: <Categories /> },
      { path: "category/:id", element: <CategoryDetails /> },
      { path: "product/:id", element: <Product /> },
      { path: "shop/:id", element: <Shop /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Admin /> },
      { path: "products", element: <AdminProducts /> },
      { path: "categories", element: <AdminCategories /> },
      { path: "shops", element: <AdminShops /> },
      { path: "reports", element: <AdminReports /> },
      { path: "settings", element: <AdminSettings /> },
      { path: "activity-logs", element: <AdminActivityLogs /> },
    ],
  },
]);

export default router;