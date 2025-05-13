
export type AuthView = "signin" | "signup" | "forgot-password";

export function getTitle(view: AuthView): string {
  switch (view) {
    case "signin":
      return "Welcome Back";
    case "signup":
      return "Create an Account";
    case "forgot-password":
      return "Reset Your Password";
    default:
      return "";
  }
}

export function getSubtitle(view: AuthView): string {
  switch (view) {
    case "signin":
      return "Sign in to your account to continue";
    case "signup":
      return "Fill in your information to create an account";
    case "forgot-password":
      return "Enter your email and we'll send you a reset link";
    default:
      return "";
  }
}

export function getButtonText(view: AuthView): string {
  switch (view) {
    case "signin":
      return "Sign In";
    case "signup":
      return "Create Account";
    case "forgot-password":
      return "Send Reset Link";
    default:
      return "";
  }
}

export const updateUserInfo = (userData: any) => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("token");
  localStorage.removeItem("cart");
  
  localStorage.setItem("userInfo", JSON.stringify(userData));
  
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("userInfoChanged"));
};

// Check if the token is expired
export const isTokenExpired = (): boolean => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
  if (!userInfo.token) return true;
  
  // Check if there's an expiration timestamp
  if (userInfo.expiresAt) {
    return Date.now() >= userInfo.expiresAt;
  }
  
  // If no expiration timestamp, the token is considered valid
  return false;
};

// Logout the user and redirect to login page
export const handleSessionExpired = () => {
  localStorage.removeItem("userInfo");
  localStorage.removeItem("token");
  
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("userInfoChanged"));
  
  // Redirect to login page with expired session message
  window.location.href = "/auth?expired=true";
};
