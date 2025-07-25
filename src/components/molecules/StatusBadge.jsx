import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, type = "order" }) => {
  const getStatusConfig = () => {
    if (type === "order") {
      const orderStatuses = {
        new: { variant: "info", label: "New Order" },
        preparing: { variant: "warning", label: "Preparing" },
        ready: { variant: "success", label: "Ready" },
        delivered: { variant: "default", label: "Delivered" }
      };
      return orderStatuses[status] || { variant: "default", label: status };
    }

    if (type === "table") {
      const tableStatuses = {
        available: { variant: "success", label: "Available" },
        occupied: { variant: "error", label: "Occupied" },
        reserved: { variant: "warning", label: "Reserved" },
        cleaning: { variant: "info", label: "Cleaning" }
      };
      return tableStatuses[status] || { variant: "default", label: status };
    }

    if (type === "menu") {
      const menuStatuses = {
        true: { variant: "success", label: "Available" },
        false: { variant: "error", label: "Unavailable" }
      };
      return menuStatuses[status] || { variant: "default", label: "Unknown" };
    }

    return { variant: "default", label: status };
  };

  const config = getStatusConfig();

  return (
    <Badge variant={config.variant} className="font-medium">
      {config.label}
    </Badge>
  );
};

export default StatusBadge;