import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  description = "There's nothing here yet.", 
  icon = "FileText",
  action,
  actionLabel = "Add New"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-64 px-6 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 font-display">
          {title}
        </h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>
        {action && (
          <Button
            onClick={action}
            className="bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;