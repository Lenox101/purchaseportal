
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube,
  Mail, 
  Phone, 
  MapPin 
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const Footer = () => {
  const year = new Date().getFullYear();
  const { theme } = useTheme();
  
  return (
    <footer className={`${theme === "dark" ? "bg-gray-900" : "bg-gray-50"} pt-16 pb-8 transition-colors duration-200`}>
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-gray-200 dark:border-gray-800">
          <div>
            <h3 className="text-xl font-bold tracking-tight mb-4">PRIME PICKS</h3>
            <p className={`${theme === "dark" ? "text-gray-400" : "text-muted-foreground"}`}>
              Crafting timeless pieces with minimalist design and exceptional quality.
            </p>
            
            <div className="flex items-center space-x-3 mt-6">
              <a 
                href="#" 
                className={`w-9 h-9 flex items-center justify-center rounded-full ${
                  theme === "dark" 
                    ? "bg-gray-800 hover:bg-primary hover:text-white" 
                    : "bg-white hover:bg-primary hover:text-white"
                } transition-colors`}
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a 
                href="#" 
                className={`w-9 h-9 flex items-center justify-center rounded-full ${
                  theme === "dark" 
                    ? "bg-gray-800 hover:bg-primary hover:text-white" 
                    : "bg-white hover:bg-primary hover:text-white"
                } transition-colors`}
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="#" 
                className={`w-9 h-9 flex items-center justify-center rounded-full ${
                  theme === "dark" 
                    ? "bg-gray-800 hover:bg-primary hover:text-white" 
                    : "bg-white hover:bg-primary hover:text-white"
                } transition-colors`}
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="#" 
                className={`w-9 h-9 flex items-center justify-center rounded-full ${
                  theme === "dark" 
                    ? "bg-gray-800 hover:bg-primary hover:text-white" 
                    : "bg-white hover:bg-primary hover:text-white"
                } transition-colors`}
                aria-label="Youtube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className={`${
                    theme === "dark" 
                      ? "text-gray-400 hover:text-primary" 
                      : "text-muted-foreground hover:text-primary"
                  } transition-colors`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className={`${
                    theme === "dark" 
                      ? "text-gray-400 hover:text-primary" 
                      : "text-muted-foreground hover:text-primary"
                  } transition-colors`}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={`${
                    theme === "dark" 
                      ? "text-gray-400 hover:text-primary" 
                      : "text-muted-foreground hover:text-primary"
                  } transition-colors`}
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className={`${
                    theme === "dark" 
                      ? "text-gray-400 hover:text-primary" 
                      : "text-muted-foreground hover:text-primary"
                  } transition-colors`}
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/faq" 
                  className={`${
                    theme === "dark" 
                      ? "text-gray-400 hover:text-primary" 
                      : "text-muted-foreground hover:text-primary"
                  } transition-colors`}
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping-returns" 
                  className={`${
                    theme === "dark" 
                      ? "text-gray-400 hover:text-primary" 
                      : "text-muted-foreground hover:text-primary"
                  } transition-colors`}
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy-policy" 
                  className={`${
                    theme === "dark" 
                      ? "text-gray-400 hover:text-primary" 
                      : "text-muted-foreground hover:text-primary"
                  } transition-colors`}
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping-returns" 
                  className={`${
                    theme === "dark" 
                      ? "text-gray-400 hover:text-primary" 
                      : "text-muted-foreground hover:text-primary"
                  } transition-colors`}
                >
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-0.5 text-primary" />
                <span className={`${theme === "dark" ? "text-gray-400" : "text-muted-foreground"}`}>
                  123 Design Street, Creative City, 10001
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 text-primary" />
                <span className={`${theme === "dark" ? "text-gray-400" : "text-muted-foreground"}`}>
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 text-primary" />
                <span className={`${theme === "dark" ? "text-gray-400" : "text-muted-foreground"}`}>
                  hello@primepicks.com
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 text-center text-sm text-muted-foreground dark:text-gray-500">
          <p>© {year} Prime Picks. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
