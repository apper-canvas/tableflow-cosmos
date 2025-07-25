import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-gradient-to-r from-success/10 to-success/20 text-success border border-success/20",
    warning: "bg-gradient-to-r from-warning/10 to-warning/20 text-warning border border-warning/20",
    error: "bg-gradient-to-r from-error/10 to-error/20 text-error border border-error/20",
    info: "bg-gradient-to-r from-info/10 to-info/20 text-info border border-info/20",
    primary: "bg-gradient-to-r from-primary/10 to-primary/20 text-primary border border-primary/20"
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], className)}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;