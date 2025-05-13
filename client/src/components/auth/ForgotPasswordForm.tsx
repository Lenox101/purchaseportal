
import { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTheme } from "@/contexts/ThemeContext";

interface ForgotPasswordFormProps {
  setView: (view: "signin" | "signup" | "forgot-password") => void;
}

const ForgotPasswordForm = ({ setView }: ForgotPasswordFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { isDark } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Password reset link sent to your email!");
      setView("signin");
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
      
      <Button 
        type="submit" 
        className="mt-6" 
        fullWidth 
        loading={isLoading}
      >
        Send Reset Link
      </Button>
      
      <div className="mt-6 text-center text-sm">
        <p className={isDark ? "text-gray-300" : ""}>
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => setView("signin")}
            className={`font-medium ${isDark ? 'text-primary hover:text-primary/90' : 'text-primary hover:text-primary/80'} transition-colors`}
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
