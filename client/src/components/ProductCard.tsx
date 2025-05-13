
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, ImageOff } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useTheme } from "@/contexts/ThemeContext";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image?: string;
  imageSrc?: string;
  category: string;
  description?: string;
  rating?: number;
  reviewCount?: number;
}

const ProductCard = ({ id, name, price, image, imageSrc, category, description, rating, reviewCount }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Make sure id is treated as a number for consistency
  const productId = Number(id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      toast.error("Please log in to add items to your cart", {
        description: "You need to be logged in to add products to your cart",
        action: {
          label: "Login",
          onClick: () => navigate("/auth")
        }
      });
      return;
    }
    
    addToCart({ 
      id: productId, 
      name, 
      price: Number(price) || 0,
      quantity: 1,
      image: imageUrl 
    });
    toast.success(`${name} added to cart`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      toast.error("Please log in to save favorites", {
        description: "You need to be logged in to save products to favorites",
        action: {
          label: "Login",
          onClick: () => navigate("/auth")
        }
      });
      return;
    }
    
    setIsFavorite(!isFavorite);
    toast.success(isFavorite ? `${name} removed from favorites` : `${name} added to favorites`);
  };

  // Format price to display with 2 decimal places
  const formatPrice = (price: number): string => {
    return price.toFixed(2);
  };

  // Use imageSrc if provided, otherwise use image
  const imageUrl = imageSrc || image;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImageError(true);
    const target = e.target as HTMLImageElement;
    target.src = "/placeholder.svg";
  };

  return (
    <Link
      to={`/products/${productId}`}
      className="group relative flex flex-col overflow-hidden rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-200 dark:bg-gray-700">
            <ImageOff className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
        )}
        
        <div className={`absolute inset-0 transition-all duration-300 ${isHovered ? (isDark ? 'bg-black/20' : 'bg-black/5') : ''}`}></div>
        
        <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={handleToggleFavorite}
            className={`flex h-8 w-8 items-center justify-center rounded-full ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} shadow-md transition-transform hover:scale-110 active:scale-95 dark:border-gray-700`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={16} className={isFavorite ? "fill-red-500 text-red-500" : isDark ? "text-gray-300" : ""} />
          </button>
          
          <button
            onClick={handleAddToCart}
            className={`flex h-8 w-8 items-center justify-center rounded-full ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} shadow-md transition-transform hover:scale-110 active:scale-95 dark:border-gray-700`}
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} className={isDark ? "text-gray-300" : ""} />
          </button>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col">
        <span className="text-xs text-muted-foreground">{category}</span>
        <h3 className="mt-1 font-medium text-base text-foreground">{name}</h3>
        <p className="mt-1 font-medium">${formatPrice(price)}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
