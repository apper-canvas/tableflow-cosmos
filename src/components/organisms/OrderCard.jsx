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
          <h3 className="text-lg font-semibold text-gray-900 font-display">
            {order.orderNumber}
          </h3>
          <StatusBadge status={order.status} type="order" />
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <ApperIcon name="MapPin" className="w-4 h-4" />
          <span>{order.tableNumber}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2 font-medium">{order.customerName}</p>
        <div className="space-y-1">
          {order.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.quantity}x {item.name}
              </span>
              <span className="text-gray-600 font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-sm text-gray-500 italic">
              +{order.items.length - 3} more items...
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-1">
          <span className="text-lg font-bold text-gray-900">
            ${order.total.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">
            {formatDistanceToNow(new Date(order.timestamp), { addSuffix: true })}
          </span>
        </div>

        {statusAction && order.status !== "delivered" && (
          <Button
            onClick={handleStatusUpdate}
            size="sm"
            className="text-sm"
          >
            <ApperIcon name={statusAction.icon} className="w-4 h-4 mr-2" />
            {statusAction.label}
          </Button>
        )}

        {order.status === "delivered" && (
          <div className="flex items-center text-success text-sm font-medium">
            <ApperIcon name="CheckCircle2" className="w-4 h-4 mr-1" />
            Completed
          </div>
        )}
      </div>

      {order.estimatedTime > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-accent">
            <ApperIcon name="Clock" className="w-4 h-4 mr-2" />
            <span>Est. {order.estimatedTime} minutes</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default OrderCard;