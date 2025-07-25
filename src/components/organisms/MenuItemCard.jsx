import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import Button from "@/components/atoms/Button";

const MenuItemCard = ({ item, onToggleAvailability, onEdit, onDelete }) => {
  const handleToggleAvailability = () => {
    if (onToggleAvailability) {
      onToggleAvailability(item.Id, !item.available_c);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${
        !item.available_c ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              {item.Name}
            </h3>
            <StatusBadge status={item.available_c} type="menu" />
          </div>
          
<p className="text-gray-600 text-sm mb-3 leading-relaxed">
            {item.description_c}
          </p>
          
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {item.category_c}
            </span>
          </div>
        </div>

<div className="flex flex-col items-end space-y-3 ml-6">
<span className="text-xl font-bold text-gray-900">
            ${(item.price_c || 0).toFixed(2)}
          </span>
          
<div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                onClick={() => onEdit(item)}
                variant="outline"
                size="sm"
                tooltip="Edit menu item"
                className="text-sm p-2 h-8 w-8"
              >
                <ApperIcon name="Edit" className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => onDelete(item.Id)}
                variant="outline"
                size="sm"
                tooltip="Delete menu item"
                className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 p-2 h-8 w-8"
              >
                <ApperIcon name="Trash2" className="w-4 h-4" />
              </Button>
            </div>
            <Button
onClick={handleToggleAvailability}
              variant={item.available_c ? "outline" : "secondary"}
              size="sm"
              tooltip={item.available_c ? "Disable menu item" : "Enable menu item"}
              className="text-sm p-2 h-8 w-8"
            >
              <ApperIcon 
                name={item.available_c ? "EyeOff" : "Eye"} 
                className="w-4 h-4" 
              />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;