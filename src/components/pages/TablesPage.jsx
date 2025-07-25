import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import tableService from "@/services/api/tableService";
import TableCard from "@/components/organisms/TableCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const TablesPage = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadTables = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await tableService.getAll();
      setTables(data);
    } catch (err) {
      setError("Failed to load tables");
      console.error("Error loading tables:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

const handleStatusUpdate = async (tableId, newStatus) => {
    try {
      await tableService.updateStatus(tableId, newStatus);
      setTables(prevTables =>
        prevTables.map(table =>
          table.Id === tableId 
            ? { 
                ...table, 
                status_c: newStatus,
                current_party_size_c: newStatus === "available" ? 0 : table.current_party_size_c,
                reservation_time_c: newStatus === "available" ? null : table.reservation_time_c
              } 
            : table
        )
      );
      
      const statusMessages = {
        available: "Table marked as available",
        occupied: "Table marked as occupied",
        reserved: "Table reserved",
        cleaning: "Table marked for cleaning"
      };
      
      toast.success(statusMessages[newStatus] || "Table status updated");
    } catch (err) {
      toast.error("Failed to update table status");
      console.error("Error updating table status:", err);
    }
  };

  const filteredTables = tables.filter(table => {
    return statusFilter === "all" || table.status_c === statusFilter;
  });

const getStatusCounts = () => {
    const counts = {
      all: tables.length,
      available: tables.filter(t => t.status_c === "available").length,
      occupied: tables.filter(t => t.status_c === "occupied").length,
      reserved: tables.filter(t => t.status_c === "reserved").length,
      cleaning: tables.filter(t => t.status_c === "cleaning").length
    };
    return counts;
  };

  const statusCounts = getStatusCounts();

  const statusFilters = [
    { key: "all", label: "All Tables", icon: "Grid3X3" },
    { key: "available", label: "Available", icon: "CheckCircle" },
    { key: "occupied", label: "Occupied", icon: "Users" },
    { key: "reserved", label: "Reserved", icon: "Clock" },
    { key: "cleaning", label: "Cleaning", icon: "Sparkles" }
  ];

const getTableStats = () => {
    const total = tables.length;
    const occupied = tables.filter(t => t.status_c === "occupied").length;
    const available = tables.filter(t => t.status_c === "available").length;
    const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;
    
    return { total, occupied, available, occupancyRate };
  };

  const stats = getTableStats();

  if (loading) return <Loading type="tables" />;
  if (error) return <Error message={error} onRetry={loadTables} />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display mb-2">
              Table Management
            </h1>
            <p className="text-gray-600">
              Monitor table status and manage restaurant floor
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-primary">{stats.total}</div>
              <div className="text-xs text-gray-600">Total Tables</div>
            </div>
            <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-success">{stats.available}</div>
              <div className="text-xs text-gray-600">Available</div>
            </div>
            <div className="bg-gradient-to-br from-error/5 to-error/10 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-error">{stats.occupied}</div>
              <div className="text-xs text-gray-600">Occupied</div>
            </div>
            <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-lg p-3 text-center">
              <div className="text-lg font-bold text-accent">{stats.occupancyRate}%</div>
              <div className="text-xs text-gray-600">Occupancy</div>
            </div>
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

      {/* Tables Grid */}
      {filteredTables.length === 0 ? (
        <Empty
          title="No tables found"
          description={statusFilter !== "all"
            ? "No tables match your current filter. Try selecting a different status."
            : "No tables have been configured yet. Add tables to start managing your restaurant floor."
          }
          icon="Grid3X3"
        />
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
        >
          {filteredTables.map((table) => (
            <TableCard
              key={table.Id}
              table={table}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default TablesPage;