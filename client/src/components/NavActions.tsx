
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  User,
  Shield,
  Menu,
  LogIn
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import UserDropdown from "./UserDropdown";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "@/contexts/ThemeContext";

type NavActionsProps = {
  cartCount: number;
  userInfo: any;
  isAdmin: boolean;
  isAdminMode: boolean;
  onToggleMobileMenu: () => void;
  onLogout: () => void;
  isMobile: boolean;
};

const NavActions = ({
  cartCount,
  userInfo,
  isAdmin,
  isAdminMode,
  onToggleMobileMenu,
  onLogout,
  isMobile
}: NavActionsProps) => {
  const { isDark } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      <ThemeToggle className="mr-1" />

      <Link to="/cart" className="relative">
        <Button variant="ghost" size="icon" aria-label="Shopping cart">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <Badge className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center p-0 text-[10px] bg-primary">
              {cartCount}
            </Badge>
          )}
        </Button>
      </Link>

      {isAdmin && isAdminMode && (
        <Link to="/admin/dashboard">
          <Button variant="ghost" size="icon" aria-label="Admin dashboard">
            <Shield className="h-5 w-5 text-white" />
          </Button>
        </Link>
      )}

      {userInfo ? (
        <UserDropdown
          userInfo={userInfo}
          onLogout={onLogout}
          isAdmin={isAdmin}
          isAdminMode={isAdminMode}
        />
      ) : (
        <Link to="/auth">
          <Button variant="ghost" size="icon" aria-label="Sign in">
            <LogIn className="h-5 w-5" />
          </Button>
        </Link>
      )}

      <Button
        variant="ghost"
        size="icon"
        className="md:hidden flex items-center justify-center hover:bg-yellow-500"
        onClick={onToggleMobileMenu}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

    </div>
  );
};

export default NavActions;
