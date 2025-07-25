import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = forwardRef(({ 
  className,
  placeholder = "Search...",
  value,
  onChange,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" 
      />
      <input
        type="text"
        className={cn(
          "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-gray-900 placeholder-gray-500",
          className
        )}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        ref={ref}
        {...props}
      />
    </div>
  );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;