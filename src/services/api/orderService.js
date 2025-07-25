import ordersData from "@/services/mockData/orders.json";

let orders = [...ordersData];

const orderService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...orders];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const order = orders.find(order => order.Id === parseInt(id));
    return order ? { ...order } : null;
  },

  async updateStatus(id, status) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const orderIndex = orders.findIndex(order => order.Id === parseInt(id));
    if (orderIndex !== -1) {
      orders[orderIndex] = { ...orders[orderIndex], status };
      return { ...orders[orderIndex] };
    }
    return null;
  },

async create(orderData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const maxId = Math.max(...orders.map(order => order.Id), 0);
    const newOrder = {
      Id: maxId + 1,
      orderNumber: orderData.orderNumber || `ORD-${Date.now().toString().slice(-6)}`,
      customerName: orderData.customerName,
      tableNumber: orderData.tableNumber,
      items: orderData.items || [],
      totalAmount: orderData.totalAmount || 0,
      status: orderData.status || 'new',
      notes: orderData.notes || '',
      timestamp: orderData.timestamp || new Date().toISOString()
    };
    orders.push(newOrder);
    return { ...newOrder };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const orderIndex = orders.findIndex(order => order.Id === parseInt(id));
    if (orderIndex !== -1) {
      const deletedOrder = orders.splice(orderIndex, 1)[0];
      return { ...deletedOrder };
    }
    return null;
  },

  async getByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return orders.filter(order => order.status === status).map(order => ({ ...order }));
  }
};

export default orderService;