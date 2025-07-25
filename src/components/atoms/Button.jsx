import React, { forwardRef, useState } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default",
  tooltip,
  children, 
  ...props 
}, ref) => {
  const [showTooltip, setShowTooltip] = useState(false);
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
    <div className="relative inline-block">
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        onMouseEnter={() => tooltip && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => tooltip && setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        {...props}
      >
        {children}
      </button>
      {tooltip && showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded whitespace-nowrap z-50 animate-fade-in">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  );
});

Button.displayName = "Button";

export default Button;