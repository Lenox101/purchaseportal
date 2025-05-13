
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

const Button = ({
  variant = "primary",
  size = "md",
  children,
  className,
  fullWidth,
  loading,
  icon,
  ...props
}: ButtonProps) => {
  const baseClasses = 
    "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none";
  
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary/90 active:bg-primary/80",
    outline: "border border-primary/20 bg-transparent text-primary hover:bg-primary/5 active:bg-primary/10",
    ghost: "bg-transparent text-primary hover:bg-primary/5 active:bg-primary/10",
    link: "bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto",
  };
  
  const sizeClasses = {
    sm: "text-xs px-3 h-8",
    md: "text-sm px-4 h-10",
    lg: "text-base px-6 h-12",
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        widthClass,
        className
      )}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {icon && !loading && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
