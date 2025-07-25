import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import orderService from '@/services/api/orderService';
import menuService from '@/services/api/menuService';
import tableService from '@/services/api/tableService';

export default function CreateOrderModal({ isOpen, onClose, onOrderCreated }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    customerName: '',
    tableId: '',
    items: [],
    notes: ''
  });
  const [availableTables, setAvailableTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tablesData, menuData, categoriesData] = await Promise.all([
        tableService.getAvailableTables(),
        menuService.getAll(),
        menuService.getCategories()
      ]);
      setAvailableTables(tablesData);
      setMenuItems(menuData.filter(item => item.available));
      setCategories(['all', ...categoriesData]);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addItemToOrder = (item) => {
    setFormData(prev => {
      const existingItem = prev.items.find(orderItem => orderItem.Id === item.Id);
      if (existingItem) {
        return {
          ...prev,
          items: prev.items.map(orderItem =>
            orderItem.Id === item.Id
              ? { ...orderItem, quantity: orderItem.quantity + 1 }
              : orderItem
          )
        };
      } else {
        return {
          ...prev,
          items: [...prev.items, { ...item, quantity: 1 }]
        };
      }
    });
    toast.success(`${item.name} added to order`);
  };

  const updateItemQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItemFromOrder(itemId);
      return;
    }
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.Id === itemId ? { ...item, quantity } : item
      )
    }));
  };

  const removeItemFromOrder = (itemId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.Id !== itemId)
    }));
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.customerName.trim() || !formData.tableId) {
        toast.error('Please fill in customer name and select a table');
        return;
      }
    } else if (currentStep === 2) {
      if (formData.items.length === 0) {
        toast.error('Please add at least one item to the order');
        return;
      }
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const selectedTable = availableTables.find(table => table.Id === parseInt(formData.tableId));
      const orderData = {
        orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
        customerName: formData.customerName.trim(),
        tableNumber: selectedTable?.number || '',
        items: formData.items.map(item => ({
          id: item.Id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount: calculateTotal(),
        status: 'new',
        notes: formData.notes.trim(),
        timestamp: new Date().toISOString()
      };

      const newOrder = await orderService.create(orderData);
      toast.success('Order created successfully!');
      onOrderCreated?.(newOrder);
      handleClose();
    } catch (error) {
      toast.error('Failed to create order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      customerName: '',
      tableId: '',
      items: [],
      notes: ''
    });
    setSelectedCategory('all');
    onClose();
  };

  const filteredMenuItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <ApperIcon name="Plus" size={16} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Create New Order</h2>
                <p className="text-sm text-gray-500">Step {currentStep} of 3</p>
              </div>
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-600"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-4 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Customer & Table</span>
              <span className="text-sm font-medium text-gray-700">Menu Items</span>
              <span className="text-sm font-medium text-gray-700">Review & Submit</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Step 1: Customer & Table */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        placeholder="Enter customer name..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Table
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {availableTables.map(table => (
                          <button
                            key={table.Id}
                            onClick={() => handleInputChange('tableId', table.Id)}
                            className={`p-4 border rounded-lg text-center transition-all ${
                              formData.tableId === table.Id
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'border-gray-300 hover:border-primary/50'
                            }`}
                          >
                            <div className="font-medium">{table.number}</div>
                            <div className="text-sm text-gray-500">Seats {table.capacity}</div>
                          </button>
                        ))}
                      </div>
                      {availableTables.length === 0 && (
                        <p className="text-gray-500 text-center py-8">No available tables</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 2: Menu Items */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                      {categories.map(category => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedCategory === category
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {category === 'all' ? 'All Items' : category}
                        </button>
                      ))}
                    </div>

                    {/* Menu Items Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredMenuItems.map(item => (
                        <div key={item.Id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            <span className="text-lg font-semibold text-primary">${item.price}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                          <Button
                            onClick={() => addItemToOrder(item)}
                            className="w-full bg-primary hover:bg-primary/90 text-white"
                            size="sm"
                          >
                            <ApperIcon name="Plus" size={14} />
                            Add to Order
                          </Button>
                        </div>
                      ))}
                    </div>

                    {/* Selected Items */}
                    {formData.items.length > 0 && (
                      <div className="border-t pt-6">
                        <h3 className="font-medium text-gray-900 mb-4">Selected Items</h3>
                        <div className="space-y-3">
                          {formData.items.map(item => (
                            <div key={item.Id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                              <div>
                                <span className="font-medium">{item.name}</span>
                                <span className="text-gray-500 ml-2">${item.price}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => updateItemQuantity(item.Id, item.quantity - 1)}
                                  className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                >
                                  <ApperIcon name="Minus" size={14} />
                                </button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => updateItemQuantity(item.Id, item.quantity + 1)}
                                  className="w-8 h-8 rounded-full bg-white border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                                >
                                  <ApperIcon name="Plus" size={14} />
                                </button>
                                <button
                                  onClick={() => removeItemFromOrder(item.Id)}
                                  className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 ml-2"
                                >
                                  <ApperIcon name="Trash2" size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Review & Submit */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Customer:</span>
                          <span className="font-medium">{formData.customerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Table:</span>
                          <span className="font-medium">
                            {availableTables.find(t => t.Id === parseInt(formData.tableId))?.number}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Items:</span>
                          <span className="font-medium">{formData.items.length}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Order Items</h4>
                      {formData.items.map(item => (
                        <div key={item.Id} className="flex justify-between items-center py-2">
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-500 ml-2">x{item.quantity}</span>
                          </div>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Notes (Optional)
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        placeholder="Any special requests or notes..."
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2">
              {currentStep > 1 && (
                <Button
                  onClick={handlePrevStep}
                  variant="outline"
                  disabled={isSubmitting}
                >
                  <ApperIcon name="ChevronLeft" size={16} />
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleClose}
                variant="ghost"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              {currentStep < 3 ? (
                <Button
                  onClick={handleNextStep}
                  className="bg-primary hover:bg-primary/90 text-white"
                  disabled={loading}
                >
                  Next
                  <ApperIcon name="ChevronRight" size={16} />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-success hover:bg-success/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Check" size={16} />
                      Create Order
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}