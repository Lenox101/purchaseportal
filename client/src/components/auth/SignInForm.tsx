
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import Button from "@/components/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/contexts/ThemeContext";
import { updateUserInfo } from "@/utils/authUtils";

interface SignInFormProps {
  setView: (view: "signin" | "signup" | "forgot-password") => void;
  setShowAdminDialog: (show: boolean) => void;
  setAdminUser: (user: any) => void;
}

const SignInForm = ({ setView, setShowAdminDialog, setAdminUser }: SignInFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();

  useEffect(() => {
    // Check for expired session query parameter
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("expired") === "true") {
      setError("Your session has expired. Please sign in again.");
      toast.error("Session expired. Please sign in again.");
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      const response = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }
      
      if (data.isAdmin) {
        setAdminUser(data);
        setShowAdminDialog(true);
        setIsLoading(false);
        return;
      }
      
      updateUserInfo(data);
      
      toast.success("Successfully signed in!");
      navigate("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          
          <button
            type="button"
            onClick={() => setView("forgot-password")}
            className={`text-xs ${isDark ? 'text-primary hover:text-primary/90' : 'text-primary hover:text-primary/80'} transition-colors`}
          >
            Forgot password?
          </button>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <Button 
        type="submit" 
        className="mt-6" 
        fullWidth 
        loading={isLoading}
      >
        Sign In
      </Button>
      
      <div className="mt-6 text-center text-sm">
        <p className={isDark ? "text-gray-300" : ""}>
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => setView("signup")}
            className={`font-medium ${isDark ? 'text-primary hover:text-primary/90' : 'text-primary hover:text-primary/80'} transition-colors`}
          >
            Sign up
          </button>
        </p>
      </div>
    </form>
  );
};

export default SignInForm;
