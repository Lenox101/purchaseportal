
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

const EmptyCart = () => {
  const { isDark } = useTheme();
  
  return (
    <div className="text-center py-16 animate-fade-in">
      <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
      <p className="text-muted-foreground mb-8">
        Looks like you haven't added any products to your cart yet.
      </p>
      <Link 
        to="/products" 
        className={`inline-flex h-10 items-center justify-center rounded-md ${
          isDark 
            ? 'bg-primary hover:bg-primary/90' 
            : 'bg-primary hover:bg-primary/90'
        } px-4 py-2 text-sm font-medium text-primary-foreground transition-colors`}
      >
        Browse Products
      </Link>
    </div>
  );
};

export default EmptyCart;
