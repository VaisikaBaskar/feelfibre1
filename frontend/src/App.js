import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./components/Navbar";
import TopHeader from "./components/TopHeader";
import AnnouncementBar from "./components/AnnouncementBar";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import HealthMix from "./pages/HealthMix";
import Combos from "./pages/Combos";
import About from "./pages/About";
import Contact from "./pages/Contact";
import InfantFood from "./pages/InfantFood";
import Wishlist from "./pages/Wishlist";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AddProduct from "./pages/admin/AddProduct";
import ManageProducts from "./pages/admin/ManageProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminReports from "./pages/admin/AdminReports";
import AdminDiscounts from "./pages/admin/AdminDiscounts";

import AdminIntegration from "./pages/admin/AdminIntegration";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminLockedUsers from "./pages/admin/AdminLockedUsers";
import EditProduct from "./pages/admin/EditProduct";
import WhatsAppButton from "./components/WhatsAppButton";
import Footer from "./components/Footer";
import ProductDetails from "./pages/ProductDetails";
import Combo from "./pages/Combo";
import BabyMix from "./pages/BabyMix";
import WhyFeelFibre from "./pages/WhyFeelFibre";
import TrackOrder from "./pages/TrackOrder";
import AdminCustomerOrders from "./pages/AdminCustomerOrders";
import ManageAddresses from "./pages/ManageAddresses";
import { useLocation } from "react-router-dom";

function MainContent({ searchTerm, setSearchTerm }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  const showHeader = !isAdmin && !isAuthPage;

  return (
    <>
      {showHeader && <AnnouncementBar />}
      {showHeader && <TopHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />}
      {showHeader && <Navbar />}

      <Routes>
        <Route path="/" element={<Home searchTerm={searchTerm} />} />
        <Route path="/products" element={<Products searchTerm={searchTerm} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/healthmix" element={<HealthMix />} />
        <Route path="/combos" element={<Combos />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/infantfood" element={<InfantFood />} />
        <Route path="/babymix" element={<BabyMix />} />
        <Route path="/combo" element={<Combo />} />
        <Route path="/why-feelfibre" element={<WhyFeelFibre />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/edit-product/:id" element={<EditProduct />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/manage-products" element={<ManageProducts />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/discounts" element={<AdminDiscounts />} />
        <Route path="/admin/locked-users" element={<AdminLockedUsers />} />

        <Route path="/admin/integration" element={<AdminIntegration />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/track-order/:id" element={<TrackOrder />} />
        <Route path="/manage-addresses" element={<ManageAddresses />} />
        <Route path="/admin/customer-orders/:id" element={<AdminCustomerOrders />} />
      </Routes>

      {showHeader && <Footer />}
      {showHeader && <WhatsAppButton />}
    </>
  );
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <BrowserRouter>
      <MainContent searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </BrowserRouter>
  );
}

export default App;
