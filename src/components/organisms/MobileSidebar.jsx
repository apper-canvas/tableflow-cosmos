import React from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const MobileSidebar = ({ isOpen, onClose }) => {
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Mobile Sidebar */}
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                    <ApperIcon name="Utensils" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-primary font-display">TableFlow</h1>
                    <p className="text-sm text-gray-500">Restaurant Management</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <ApperIcon name="X" className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <nav className="space-y-2">
                {navigationItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
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
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebar;