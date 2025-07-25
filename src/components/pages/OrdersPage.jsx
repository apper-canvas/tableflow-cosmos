import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import orderService from '@/services/api/orderService'
import SearchBar from '@/components/molecules/SearchBar'
import OrderCard from '@/components/organisms/OrderCard'
import CreateOrderModal from '@/components/organisms/CreateOrderModal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getAll();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus);
      await loadOrders();
      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const handleOrderCreated = (newOrder) => {
    loadOrders(); // Refresh the orders list
  };

const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name_c?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.table_number_c?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.status_c === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

const getStatusCounts = () => {
    const counts = {
      all: orders.length,
      new: orders.filter(o => o.status_c === "new").length,
      preparing: orders.filter(o => o.status_c === "preparing").length,
      ready: orders.filter(o => o.status_c === "ready").length,
      delivered: orders.filter(o => o.status_c === "delivered").length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  const statusFilters = [
    { key: "all", label: "All Orders", icon: "List" },
    { key: "new", label: "New", icon: "Plus" },
    { key: "preparing", label: "In Progress", icon: "ChefHat" },
    { key: "ready", label: "Ready", icon: "CheckCircle" },
    { key: "delivered", label: "Delivered", icon: "Truck" },
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadOrders} />;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">Orders</h1>
            <p className="text-gray-600 mt-1">Manage and track all restaurant orders</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 sm:items-center sm:justify-between">
            <SearchBar
              placeholder="Search orders, customers, or tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80"
            />
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap"
            >
              <ApperIcon name="Plus" size={16} />
              Create Order
            </Button>
          </div>
        </div>

        {/* Status Filter */}
        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => setStatusFilter(filter.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  statusFilter === filter.key
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-primary/30'
                }`}
              >
                <ApperIcon name={filter.icon} size={16} />
                {filter.label}
                <span className={`text-xs px-2 py-1 rounded-full ${
                  statusFilter === filter.key
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {statusCounts[filter.key]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <Empty 
          message={searchQuery || statusFilter !== "all" 
            ? "No orders match your search criteria" 
            : "No orders yet"
          }
          subMessage={searchQuery || statusFilter !== "all"
            ? "Try adjusting your search or filter"
            : "Orders will appear here once created"
          }
        />
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {filteredOrders.map((order, index) => (
            <motion.div
              key={order.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <OrderCard order={order} onStatusUpdate={handleStatusUpdate} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onOrderCreated={handleOrderCreated}
      />
    </div>
  );
}