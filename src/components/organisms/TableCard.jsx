import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import Button from "@/components/atoms/Button";
import { formatDistanceToNow } from "date-fns";

const TableCard = ({ table, onStatusUpdate }) => {
  const getStatusColor = () => {
    const colors = {
      available: "border-success/20 bg-success/5",
      occupied: "border-error/20 bg-error/5",
      reserved: "border-warning/20 bg-warning/5",
      cleaning: "border-info/20 bg-info/5"
    };
    return colors[table.status] || "border-gray-200 bg-gray-50";
  };

  const getStatusIcon = () => {
    const icons = {
      available: "CheckCircle2",
      occupied: "Users",
      reserved: "Clock",
      cleaning: "Sparkles"
    };
    return icons[table.status] || "Square";
  };

  const handleStatusUpdate = (newStatus) => {
    if (onStatusUpdate) {
      onStatusUpdate(table.Id, newStatus);
    }
  };

  const getQuickActions = () => {
    switch (table.status) {
      case "available":
        return [
          { label: "Seat Party", status: "occupied", icon: "Users", variant: "primary" }
        ];
      case "occupied":
        return [
          { label: "Clear Table", status: "cleaning", icon: "Sparkles", variant: "secondary" }
        ];
      case "cleaning":
        return [
          { label: "Mark Available", status: "available", icon: "CheckCircle2", variant: "secondary" }
        ];
      case "reserved":
        return [
          { label: "Seat Party", status: "occupied", icon: "Users", variant: "primary" }
        ];
      default:
        return [];
    }
  };

  const quickActions = getQuickActions();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`rounded-xl p-6 shadow-sm border-2 transition-all duration-200 hover:shadow-md ${getStatusColor()}`}
    >
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <div className="flex items-center space-x-2">
          <ApperIcon 
            name={getStatusIcon()} 
            className="w-6 h-6 text-gray-600" 
          />
          <h3 className="text-xl font-bold text-gray-900 font-display">
            {table.number}
          </h3>
        </div>

        <StatusBadge status={table.status} type="table" />

        <div className="text-center space-y-1">
          <p className="text-sm text-gray-600">
            Capacity: {table.capacity} guests
          </p>
          {table.currentPartySize > 0 && (
            <p className="text-sm font-medium text-gray-700">
              Party of {table.currentPartySize}
            </p>
          )}
          {table.reservationTime && (
            <p className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(table.reservationTime), { addSuffix: true })}
            </p>
          )}
        </div>

        {quickActions.length > 0 && (
          <div className="w-full space-y-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                onClick={() => handleStatusUpdate(action.status)}
                variant={action.variant}
                size="sm"
                className="w-full text-sm"
              >
                <ApperIcon name={action.icon} className="w-4 h-4 mr-2" />
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TableCard;