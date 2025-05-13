import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import NavLinks from "./NavLinks";
import NavActions from "./NavActions";
import MobileMenu from "./MobileMenu";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const { getCartCount } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const loadUserInfo = () => {
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      try {
        const parsedUserInfo = JSON.parse(storedUserInfo);
        setUserInfo(parsedUserInfo);
      } catch (error) {
        console.error("Error parsing user info:", error);
        setUserInfo(null);
      }
    } else {
      setUserInfo(null);
    }
  };

  useEffect(() => {
    loadUserInfo();
    window.addEventListener("userInfoChanged", loadUserInfo);
    return () => {
      window.removeEventListener("userInfoChanged", loadUserInfo);
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "userInfo" || e.key === null) {
        loadUserInfo();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Prevent body scrolling when menu is open
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setUserInfo(null);
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("userInfoChanged"));
    toast.success("Logged out successfully");
    navigate("/");
  };

  const cartCount = getCartCount();

  const isAdmin = userInfo?.isAdmin === true;
  const isAdminMode = userInfo?.adminMode === true;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isAdminMode 
          ? "bg-primary/95 text-white" 
          : "bg-white dark:bg-gray-900"
      } shadow-sm`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex flex-col">
          <Link 
            to="/"
            className={`text-xl font-bold tracking-tight hover:opacity-80 transition-opacity ${
              isAdminMode ? "text-white" : ""
            }`}
          >
            PRIME PICKS
          </Link>
          {userInfo?.name && !isMobile && (
            <span className="text-sm text-muted-foreground -mt-1 text-white">
              Welcome, {userInfo.name} {isAdminMode && (
                <span className="text-white font-medium">(Admin Mode)</span>
              )}
            </span>
          )}
          {userInfo?.name && isMobile && isAdminMode && (
            <span className="text-xs text-white font-semibold -mt-1">
              Admin Mode
            </span>
          )}
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <NavLinks isAdminMode={isAdminMode} />
        </nav>
        
        <NavActions 
          cartCount={cartCount}
          userInfo={userInfo}
          isAdmin={isAdmin}
          isAdminMode={isAdminMode}
          onToggleMobileMenu={toggleMobileMenu}
          onLogout={handleLogout}
          isMobile={isMobile}
        />
      </div>
      
      <MobileMenu 
        isOpen={isMobileMenuOpen}
        userInfo={userInfo}
        isAdmin={isAdmin}
        isAdminMode={isAdminMode}
        onClose={toggleMobileMenu}
        onLogout={handleLogout}
      />
    </header>
  );
};

export default Navbar;
