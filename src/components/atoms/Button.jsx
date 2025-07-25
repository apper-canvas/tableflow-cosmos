import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-md hover:shadow-lg hover:scale-105 focus:ring-primary/50",
    secondary: "bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white shadow-md hover:shadow-lg hover:scale-105 focus:ring-accent/50",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary/50",
    ghost: "text-gray-600 hover:text-primary hover:bg-primary/5 focus:ring-primary/50",
    danger: "bg-gradient-to-r from-error to-error/90 hover:from-error/90 hover:to-error text-white shadow-md hover:shadow-lg hover:scale-105 focus:ring-error/50"
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4 py-2",
    lg: "h-12 px-6 text-lg"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;