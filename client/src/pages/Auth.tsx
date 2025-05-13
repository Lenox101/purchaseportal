
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";
import { AuthView, getTitle, getSubtitle, getButtonText } from "@/utils/authUtils";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import AdminLoginDialog from "@/components/auth/AdminLoginDialog";

const Auth = () => {
  const [view, setView] = useState<AuthView>("signin");
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  
  const handleLoginAs = (isAdminLogin: boolean) => {
    if (!adminUser) return;

    const userInfo = {
      ...adminUser,
      adminMode: isAdminLogin,
      isAdmin: true
    };
    
    // Update user info in localStorage
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    
    // Dispatch events to notify about user info change
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("userInfoChanged"));
    
    toast.success(`Signed in as ${isAdminLogin ? 'Admin' : 'Regular User'}`);
    
    if (isAdminLogin) {
      navigate("/admin/dashboard");
    } else {
      navigate("/");
    }
    
    setShowAdminDialog(false);
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            {getTitle(view)}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {getSubtitle(view)}
          </p>
        </div>
        
        <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {view === "signin" && (
            <SignInForm 
              setView={setView} 
              setShowAdminDialog={setShowAdminDialog}
              setAdminUser={setAdminUser}
            />
          )}
          
          {view === "signup" && (
            <SignUpForm setView={setView} />
          )}
          
          {view === "forgot-password" && (
            <ForgotPasswordForm setView={setView} />
          )}
        </div>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            By continuing, you agree to our{" "}
            <a href="#" className="font-medium text-primary hover:text-primary/80">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="font-medium text-primary hover:text-primary/80">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      <AdminLoginDialog 
        open={showAdminDialog} 
        onOpenChange={setShowAdminDialog}
        onLoginAs={handleLoginAs}
      />
    </div>
  );
};

export default Auth;
