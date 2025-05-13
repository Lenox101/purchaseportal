
import { Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";

interface NavLinksProps {
  isAdminMode: boolean;
  isMobile?: boolean;
  onClick?: () => void;
}

const NavLinks = ({ isAdminMode, isMobile = false, onClick }: NavLinksProps) => {
  const { isDark } = useTheme();
  
  const baseClassName = isMobile 
    ? `text-lg font-medium py-3 block transition-colors hover:text-primary` 
    : `text-sm font-medium transition-colors hover:text-red-500`;

  return (
    <>
      <Link 
        to="/" 
        className={baseClassName}
        onClick={onClick}
      >
        Home
      </Link>
      <Link 
        to="/products" 
        className={baseClassName}
        onClick={onClick}
      >
        Products
      </Link>
      <Link 
        to="/contact" 
        className={baseClassName}
        onClick={onClick}
      >
        Contact
      </Link>
      <Link 
        to="/chat" 
        className={baseClassName}
        onClick={onClick}
      >
        Chat
      </Link>
      <Link 
        to="/faq" 
        className={baseClassName}
        onClick={onClick}
      >
        FAQ
      </Link>
      {isAdminMode && (
        <Link 
          to="/admin/dashboard" 
          className={`${baseClassName} ${!isMobile ? 'text-white bg-primary/80 px-2 py-1 rounded' : 'text-white font-semibold'}`}
          onClick={onClick}
        >
          Admin Dashboard
        </Link>
      )}
    </>
  );
};

export default NavLinks;
