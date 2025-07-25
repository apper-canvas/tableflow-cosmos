import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import Button from "@/components/atoms/Button";
import { formatDistanceToNow } from "date-fns";

const OrderCard = ({ order, onStatusUpdate }) => {
  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      new: "preparing",
      preparing: "ready",
      ready: "delivered"
    };
    return statusFlow[currentStatus];
  };

  const handleStatusUpdate = () => {
    const nextStatus = getNextStatus(order.status);
    if (nextStatus && onStatusUpdate) {
      onStatusUpdate(order.Id, nextStatus);
    }
  };

  const getStatusAction = () => {
    const actions = {
      new: { label: "Start Preparing", icon: "ChefHat" },
      preparing: { label: "Mark Ready", icon: "CheckCircle" },
      ready: { label: "Mark Delivered", icon: "Truck" }
    };
    return actions[order.status];
  };

  const statusAction = getStatusAction();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
    >
<div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium text-gray-600">
            {order.orderNumber}
          </span>
          <StatusBadge status={order.status} type="order" />
        </div>
        <div className="flex items-center space-x-2">
          <div className="bg-primary/10 border border-primary/20 rounded-lg px-3 py-1.5">
            <div className="flex items-center space-x-2">
              <ApperIcon name="MapPin" className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Table {order.tableNumber}</span>
            </div>
          </div>
        </div>
      </div>

<div className="mb-4">
        <p className="text-sm text-gray-600 mb-2 font-medium">{order.customerName}</p>
        <div className="space-y-1">
          {(order.items || []).slice(0, 3).map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.quantity}x {item.name}
              </span>
              <span className="text-gray-600 font-medium">
                ${((item.price || 0) * (item.quantity || 0)).toFixed(2)}
              </span>
            </div>
          ))}
          {(order.items || []).length > 3 && (
            <p className="text-sm text-gray-500 italic">
              +{(order.items || []).length - 3} more items...
            </p>
          )}
        </div>
      </div>

<div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <span className="text-lg font-bold text-gray-900">
            ${(order.total || 0).toFixed(2)}
          </span>
          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 rounded-md px-2 py-1">
            <ApperIcon name="Clock" className="w-4 h-4" />
            <span className="font-medium">
              {formatDistanceToNow(new Date(order.timestamp), { addSuffix: true })}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2">
          {statusAction && order.status !== "delivered" && (
            <Button
              onClick={handleStatusUpdate}
              size="sm"
              className="text-sm px-4 py-2 font-medium"
            >
              <ApperIcon name={statusAction.icon} className="w-4 h-4 mr-2" />
              {statusAction.label}
            </Button>
          )}

          {order.status === "delivered" && (
            <div className="flex items-center text-success text-sm font-semibold bg-success/10 rounded-md px-3 py-1.5">
              <ApperIcon name="CheckCircle2" className="w-4 h-4 mr-2" />
              Completed
            </div>
          )}
        </div>
      </div>

{order.estimatedTime > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-center bg-accent/10 border border-accent/20 rounded-lg px-4 py-2">
            <ApperIcon name="Timer" className="w-4 h-4 mr-2 text-accent" />
            <span className="text-sm font-semibold text-accent">
              Estimated: {order.estimatedTime} minutes
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default OrderCard;