
import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { CartProvider } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "@/pages/Index";
import Products from "@/pages/Products";
import ProductDetail from "@/pages/ProductDetail";
import Auth from "@/pages/Auth";
import Cart from "@/pages/Cart";
import NotFound from "@/pages/NotFound";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import ShippingReturns from "@/pages/ShippingReturns";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Chat from "@/pages/Chat";
import MyOrders from "@/pages/MyOrders";
import OrderDetails from "@/pages/OrderDetails";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminProducts from "@/pages/AdminProducts";
import AdminOrders from "@/pages/AdminOrders";
import AdminUsers from "@/pages/AdminUsers";
import AutoLogout from "@/components/auth/AutoLogout";
import "./App.css";

const App = () => {
  return (
    <ThemeProvider>
      <CartProvider>
        <Navbar />
        <AutoLogout />
        <main>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/shipping-returns" element={<ShippingReturns />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/order-details/:id" element={<OrderDetails />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
        <Toaster richColors position="top-center" />
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;
