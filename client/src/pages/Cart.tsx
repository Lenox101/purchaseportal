
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "@/contexts/ThemeContext";
import CartItemList from "@/components/cart/CartItemList";
import EmptyCart from "@/components/cart/EmptyCart";
import CartPaymentSection from "@/components/cart/CartPaymentSection";

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isPaymentFormVisible, setIsPaymentFormVisible] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { isDark } = useTheme();
  const navigate = useNavigate();
  
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    if (userInfo.email) {
      setUserEmail(userInfo.email);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      // If user is not authenticated, redirect to login
      if (cartItems.length > 0) {
        toast.error("Please log in to view your cart", {
          description: "You need to be logged in to access your cart",
          action: {
            label: "Login",
            onClick: () => navigate("/auth")
          }
        });
        navigate("/auth");
      }
    }
  }, [cartItems.length, navigate]);
  
  // Format price safely to handle both string and number types
  const formatPrice = (price: number | string): number => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice || 0;
  };
  
  const subtotal = cartItems.reduce(
    (total, item) => total + (formatPrice(item.price) * item.quantity), 
    0
  );
  
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to checkout", {
        description: "You need to be logged in to complete your purchase",
        action: {
          label: "Login",
          onClick: () => navigate("/auth")
        }
      });
      navigate("/auth");
      return;
    }
    setIsPaymentFormVisible(true);
  };
  
  const handlePaymentComplete = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
      
      if (!userInfo.token) {
        toast.error("Please log in to complete your order");
        navigate("/auth");
        return;
      }
      
      // Prepare order data
      const orderData = {
        orderItems: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          name: item.name,
          price: formatPrice(item.price)
        })),
        shippingAddress: {
          address: "123 Main St",
          city: "Seattle",
          state: "WA",
          postalCode: "98101",
          country: "United States"
        },
        paymentMethod: "Credit Card",
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shipping,
        totalPrice: total
      };
      
      // Submit order to API
      const response = await fetch("http://localhost:4000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(orderData)
      });
      
      if (!response.ok) {
        throw new Error("Failed to create order");
      }
      
      const data = await response.json();
      
      // Clear cart
      clearCart();
      
      toast.success("Order placed successfully!");
      
      // Redirect to order details page
      setTimeout(() => {
        navigate(`/order-details/${data.id}`);
      }, 1000);
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };
  
  if (!isAuthenticated && cartItems.length > 0) {
    return null; // Return nothing while redirecting
  }
  
  return (
    <div className="pt-24 pb-20">
      <div className="container">
        <h1 className="heading-lg mb-8">Your Cart</h1>
        
        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <CartItemList 
              cartItems={cartItems}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              formatPrice={formatPrice}
              isDark={isDark}
            />
            
            <CartPaymentSection
              isPaymentFormVisible={isPaymentFormVisible}
              userEmail={userEmail}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              onCheckout={handleCheckout}
              onPaymentComplete={handlePaymentComplete}
            />
          </div>
        ) : (
          <EmptyCart />
        )}
      </div>
    </div>
  );
};

export default Cart;
