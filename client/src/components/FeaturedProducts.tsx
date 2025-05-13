
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { useCart } from "@/contexts/CartContext";
import Button from "./Button";
import axios from "axios";

// Define product interface
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image?: string;
}

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, isDark } = useTheme();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log("Fetching featured products...");
        // Fetch products from the API
        const response = await axios.get('http://localhost:4000/api/products');
        console.log("API response:", response.data);
        
        // Take the first 4 products from the response
        const featuredProducts = response.data.slice(0, 4);
        setProducts(featuredProducts);
      } catch (error) {
        console.error("Error fetching featured products:", error);
        setError("Failed to load products. Please try again later.");
        // If API fails, use empty array
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    
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
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: `http://localhost:4000/api/products/${product.id}/image`
    });
    toast.success(`${product.name} added to cart`);
  };
  
  return (
    <section className={`py-20 ${theme === "dark" ? "bg-gray-900" : "bg-white"} transition-colors duration-200`}>
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-sm bg-primary/30 text-white px-2 py-1 rounded font-medium">Featured Products</span>
          <h2 className={`heading-lg mt-2 ${theme === "dark" ? "text-white" : ""}`}>Our Best Sellers</h2>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
            <p className={`mt-2 ${theme === "dark" ? "text-white" : ""}`}>Loading products...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className={`text-red-500 ${theme === "dark" ? "text-opacity-90" : ""}`}>{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8">
            <p className={`${theme === "dark" ? "text-white" : ""}`}>No products available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="group relative overflow-hidden rounded-lg">
                <div className="aspect-w-3 aspect-h-4">
                  <img 
                    src={`http://localhost:4000/api/products/${product.id}/image`}
                    alt={product.name} 
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-semibold mb-1">{product.name}</h3>
                  <p className="text-sm opacity-90">{product.category}</p>
                  <p className="mt-2">${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}</p>
                  
                  <Button 
                    size="sm" 
                    className="mt-4 bg-white text-primary hover:bg-white/90"
                    onClick={(e) => handleQuickAdd(e, product)}
                  >
                    Quick Add
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <Link 
            to="/products" 
            className={`inline-flex items-center text-sm font-medium ${
              isDark 
                ? 'text-primary-foreground hover:text-primary-foreground/80' 
                : 'text-primary hover:text-primary/80'
            } transition-colors`}
          >
            View All Products
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
