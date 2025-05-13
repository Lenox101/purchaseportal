
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import NavLinks from "./NavLinks";

interface MobileMenuProps {
  isOpen: boolean;
  userInfo: any;
  isAdmin: boolean;
  isAdminMode: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const MobileMenu = ({ 
  isOpen, 
  userInfo, 
  isAdmin,
  isAdminMode,
  onClose, 
  onLogout 
}: MobileMenuProps) => {
  if (!isOpen) return null;

  const handleLogoutClick = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight" onClick={onClose}>
          PRIME PICKS
        </Link>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-secondary transition-colors"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="container mx-auto px-4 pt-4 pb-8 flex-1 overflow-y-auto">
        <nav className="flex flex-col space-y-1">
          <div className="flex flex-col space-y-3">
            <NavLinks isAdminMode={isAdminMode} isMobile={true} onClick={onClose} />
          </div>
          
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-4"></div>
          
          <Link 
            to="/my-orders" 
            className="text-lg font-medium py-3 hover:text-primary transition-colors text-center"
            onClick={onClose}
          >
            My Orders
          </Link>
          <Link 
            to="/cart" 
            className="text-lg font-medium py-3 hover:text-primary transition-colors text-center"
            onClick={onClose}
          >
            Cart
          </Link>
          {userInfo ? (
            <>
              <Link 
                to="/profile" 
                className="text-lg font-medium py-3 hover:text-primary transition-colors text-center"
                onClick={onClose}
              >
                Profile
              </Link>
              <Link 
                to="/settings" 
                className="text-lg font-medium py-3 hover:text-primary transition-colors text-center"
                onClick={onClose}
              >
                Settings
              </Link>
              {isAdmin && (
                <Link 
                  to="/admin/dashboard" 
                  className="text-lg font-medium text-primary py-3 hover:text-primary/80 transition-colors text-center"
                  onClick={onClose}
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogoutClick}
                className="text-lg font-medium text-red-600 py-3 hover:text-red-700 transition-colors w-full text-center mt-4"
              >
                Logout
              </button>
            </>
          ) : (
            <Link 
              to="/auth" 
              className="text-lg font-medium py-3 hover:text-primary transition-colors text-center"
              onClick={onClose}
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
