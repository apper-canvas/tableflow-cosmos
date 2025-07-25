import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ title, onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden p-2"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-primary font-display">{title}</h2>
            <p className="text-sm text-gray-500">Bella Vista Restaurant</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
            <ApperIcon name="Clock" className="w-4 h-4" />
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;