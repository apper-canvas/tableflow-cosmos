import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import Button from "@/components/atoms/Button";

const MenuItemCard = ({ item, onToggleAvailability, onEdit, onDelete }) => {
  const handleToggleAvailability = () => {
    if (onToggleAvailability) {
      onToggleAvailability(item.Id, !item.available);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 ${
        !item.available ? "opacity-75" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 font-display">
              {item.name}
            </h3>
            <StatusBadge status={item.available} type="menu" />
          </div>
          
          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
            {item.description}
          </p>
          
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
              {item.category}
            </span>
          </div>
        </div>

<div className="flex flex-col items-end space-y-3 ml-6">
          <span className="text-xl font-bold text-gray-900">
            ${item.price.toFixed(2)}
          </span>
          
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button
                onClick={() => onEdit(item)}
                variant="outline"
                size="sm"
                className="text-sm"
              >
                <ApperIcon name="Edit" className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button
                onClick={() => onDelete(item.Id)}
                variant="outline"
                size="sm"
                className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <ApperIcon name="Trash2" className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
            <Button
              onClick={handleToggleAvailability}
              variant={item.available ? "outline" : "secondary"}
              size="sm"
              className="text-sm"
            >
              <ApperIcon 
                name={item.available ? "EyeOff" : "Eye"} 
                className="w-4 h-4 mr-2" 
              />
              {item.available ? "Disable" : "Enable"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuItemCard;