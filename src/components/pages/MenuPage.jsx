import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import menuService from "@/services/api/menuService";
import SearchBar from "@/components/molecules/SearchBar";
import MenuItemCard from "@/components/organisms/MenuItemCard";
import MenuItemModal from "@/components/organisms/MenuItemModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
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

const handleCreate = async (itemData) => {
    try {
      const newItem = await menuService.create(itemData);
      setMenuItems(prev => [...prev, newItem]);
      toast.success("Menu item created successfully!");
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to create menu item");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleUpdate = async (itemData) => {
    try {
      const updatedItem = await menuService.update(editingItem.Id, itemData);
      setMenuItems(prev => prev.map(item => 
        item.Id === editingItem.Id ? updatedItem : item
      ));
      toast.success("Menu item updated successfully!");
      setIsModalOpen(false);
      setEditingItem(null);
    } catch (error) {
      toast.error("Failed to update menu item");
    }
  };

  const handleDelete = (itemId) => {
    setDeleteConfirmId(itemId);
  };

  const confirmDelete = async () => {
    try {
      await menuService.delete(deleteConfirmId);
      setMenuItems(prev => prev.filter(item => item.Id !== deleteConfirmId));
      toast.success("Menu item deleted successfully!");
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error("Failed to delete menu item");
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
          
<div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <SearchBar
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full lg:w-80"
            />
            <Button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              <ApperIcon name="Plus" size={16} />
              Add Item
            </Button>
          </div>
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
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </motion.div>
)}

      {/* Create/Edit Modal */}
      <MenuItemModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={editingItem ? handleUpdate : handleCreate}
        item={editingItem}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Trash2" className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Menu Item</h3>
                <p className="text-sm text-gray-600">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmId(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmDelete}
              >
                Delete
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MenuPage;