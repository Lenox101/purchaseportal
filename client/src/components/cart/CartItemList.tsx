
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CartItem as CartItemType } from "@/contexts/CartContext";
import CartItem from "./CartItem";

interface CartItemListProps {
  cartItems: CartItemType[];
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  formatPrice: (price: number | string) => number;
  isDark: boolean;
}

const CartItemList = ({ 
  cartItems, 
  updateQuantity, 
  removeFromCart, 
  formatPrice,
  isDark
}: CartItemListProps) => {
  return (
    <div className="lg:col-span-2">
      <div className="rounded-lg border">
        <div className="p-6 space-y-6 divide-y">
          {cartItems.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
              formatPrice={formatPrice}
            />
          ))}
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
        <Link 
          to="/products" 
          className={`inline-flex items-center text-sm font-medium ${
            isDark 
              ? 'text-white hover:text-white/80' 
              : 'text-primary hover:text-primary/80'
          } transition-colors`}
        >
          <ArrowRight size={16} className="mr-1 rotate-180" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default CartItemList;
