
import { Link } from "react-router-dom";
import { Trash, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { CartItem as CartItemType } from "@/contexts/CartContext";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  formatPrice: (price: number | string) => number;
}

const CartItem = ({ item, updateQuantity, removeFromCart, formatPrice }: CartItemProps) => {
  return (
    <div className="pt-6 first:pt-0">
      <div className="flex items-start gap-4 animate-fade-in">
        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-50">
          <img 
            src={item.image} 
            alt={item.name}
            className="h-full w-full object-cover object-center"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        </div>
        
        <div className="flex-grow">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium text-base">
                <Link to={`/products/${item.id}`} className="hover:text-primary">
                  {item.name}
                </Link>
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                ${formatPrice(item.price).toFixed(2)}
              </p>
            </div>
            
            <p className="text-right font-medium">
              ${(formatPrice(item.price) * item.quantity).toFixed(2)}
            </p>
          </div>
          
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center border rounded-md">
              <button 
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground disabled:opacity-50"
                aria-label="Decrease quantity"
              >
                <Minus size={14} />
              </button>
              
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground"
                aria-label="Increase quantity"
              >
                <Plus size={14} />
              </button>
            </div>
            
            <button
              onClick={() => {
                removeFromCart(item.id);
                toast.success(`${item.name} removed from cart`);
              }}
              className="flex items-center text-sm text-red-500 hover:text-red-700 transition-colors"
              aria-label="Remove item"
            >
              <Trash size={14} className="mr-1" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
