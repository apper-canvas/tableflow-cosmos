import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import orderService from "@/services/api/orderService";
import SearchBar from "@/components/molecules/SearchBar";
import OrderCard from "@/components/organisms/OrderCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await orderService.getAll();
      setOrders(data);
    } catch (err) {
      setError("Failed to load orders");
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.Id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success(`Order ${newStatus === "delivered" ? "completed" : "updated"} successfully!`);
    } catch (err) {
      toast.error("Failed to update order status");
      console.error("Error updating order status:", err);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      new: orders.filter(o => o.status === "new").length,
      preparing: orders.filter(o => o.status === "preparing").length,
      ready: orders.filter(o => o.status === "ready").length,
      delivered: orders.filter(o => o.status === "delivered").length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  const statusFilters = [
    { key: "all", label: "All Orders", icon: "List" },
    { key: "new", label: "New", icon: "Plus" },
    { key: "preparing", label: "In Progress", icon: "ChefHat" },
    { key: "ready", label: "Ready", icon: "CheckCircle" },
    { key: "delivered", label: "Completed", icon: "Truck" }
  ];

  if (loading) return <Loading type="orders" />;
  if (error) return <Error message={error} onRetry={loadOrders} />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display mb-2">
              Order Management
            </h1>
            <p className="text-gray-600">
              Track and manage all restaurant orders in real-time
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <SearchBar
              placeholder="Search orders, customers, or tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80"
            />
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-wrap gap-2">
          {statusFilters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setStatusFilter(filter.key)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                statusFilter === filter.key
                  ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ApperIcon name={filter.icon} className="w-4 h-4" />
              <span>{filter.label}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                statusFilter === filter.key
                  ? "bg-white/20 text-white"
                  : "bg-white text-gray-600"
              }`}>
                {statusCounts[filter.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Empty
          title="No orders found"
          description={searchQuery || statusFilter !== "all" 
            ? "No orders match your current filters. Try adjusting your search or filter criteria."
            : "No orders have been placed yet. Orders will appear here as they come in."
          }
          icon="ClipboardList"
        />
      ) : (
        <motion.div 
          layout
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
        >
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.Id}
              order={order}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default OrdersPage;