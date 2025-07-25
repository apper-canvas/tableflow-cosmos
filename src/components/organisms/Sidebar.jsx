import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ className, onItemClick }) => {
  const navigationItems = [
    {
      name: "Orders",
      path: "/orders",
      icon: "ClipboardList"
    },
    {
      name: "Menu",
      path: "/menu",
      icon: "ChefHat"
    },
    {
      name: "Tables",
      path: "/tables",
      icon: "Grid3X3"
    }
  ];

  return (
    <aside className={cn("bg-white border-r border-gray-200 shadow-sm", className)}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
            <ApperIcon name="Utensils" className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary font-display">TableFlow</h1>
            <p className="text-sm text-gray-500">Restaurant Management</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onItemClick}
              className={({ isActive }) =>
                cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-primary/5 hover:text-primary transition-all duration-200 group",
                  isActive && "bg-gradient-to-r from-primary/10 to-primary/5 text-primary border-l-4 border-primary"
                )
              }
            >
              <ApperIcon 
                name={item.icon} 
                className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" 
              />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;