import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import menuService from "@/services/api/menuService";
import SearchBar from "@/components/molecules/SearchBar";
import MenuItemCard from "@/components/organisms/MenuItemCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  const loadMenuData = async () => {
    try {
      setLoading(true);
      setError("");
      const [itemsData, categoriesData] = await Promise.all([
        menuService.getAll(),
        menuService.getCategories()
      ]);
      setMenuItems(itemsData);
      setCategories(categoriesData);
    } catch (err) {
      setError("Failed to load menu data");
      console.error("Error loading menu data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenuData();
  }, []);

  const handleToggleAvailability = async (itemId, available) => {
    try {
      await menuService.updateAvailability(itemId, available);
      setMenuItems(prevItems =>
        prevItems.map(item =>
          item.Id === itemId ? { ...item, available } : item
        )
      );
      toast.success(`Item ${available ? "enabled" : "disabled"} successfully!`);
    } catch (err) {
      toast.error("Failed to update item availability");
      console.error("Error updating availability:", err);
    }
  };

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesAvailability = 
      availabilityFilter === "all" || 
      (availabilityFilter === "available" && item.available) ||
      (availabilityFilter === "unavailable" && !item.available);
    
    return matchesSearch && matchesCategory && matchesAvailability;
  });

  const getAvailabilityCounts = () => {
    return {
      all: menuItems.length,
      available: menuItems.filter(item => item.available).length,
      unavailable: menuItems.filter(item => !item.available).length
    };
  };

  const availabilityCounts = getAvailabilityCounts();

  const availabilityFilters = [
    { key: "all", label: "All Items", icon: "List" },
    { key: "available", label: "Available", icon: "CheckCircle" },
    { key: "unavailable", label: "Unavailable", icon: "XCircle" }
  ];

  if (loading) return <Loading type="menu" />;
  if (error) return <Error message={error} onRetry={loadMenuData} />;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display mb-2">
              Menu Management
            </h1>
            <p className="text-gray-600">
              Manage menu items, pricing, and availability
            </p>
          </div>
          
          <SearchBar
            placeholder="Search menu items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full lg:w-80"
          />
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="space-y-4">
          {/* Availability Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Availability</h3>
            <div className="flex flex-wrap gap-2">
              {availabilityFilters.map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setAvailabilityFilter(filter.key)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    availabilityFilter === filter.key
                      ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ApperIcon name={filter.icon} className="w-4 h-4" />
                  <span>{filter.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    availabilityFilter === filter.key
                      ? "bg-white/20 text-white"
                      : "bg-white text-gray-600"
                  }`}>
                    {availabilityCounts[filter.key]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter("all")}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  categoryFilter === "all"
                    ? "bg-gradient-to-r from-accent to-accent/90 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    categoryFilter === category
                      ? "bg-gradient-to-r from-accent to-accent/90 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items List */}
      {filteredItems.length === 0 ? (
        <Empty
          title="No menu items found"
          description={searchQuery || categoryFilter !== "all" || availabilityFilter !== "all"
            ? "No menu items match your current filters. Try adjusting your search or filter criteria."
            : "No menu items have been added yet. Add items to start building your menu."
          }
          icon="ChefHat"
        />
      ) : (
        <motion.div 
          layout
          className="space-y-4"
        >
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.Id}
              item={item}
              onToggleAvailability={handleToggleAvailability}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default MenuPage;