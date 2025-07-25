import menuData from "@/services/mockData/menuItems.json";

let menuItems = [...menuData];

const menuService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...menuItems];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const item = menuItems.find(item => item.Id === parseInt(id));
    return item ? { ...item } : null;
  },

  async getByCategory(category) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return menuItems.filter(item => item.category === category).map(item => ({ ...item }));
  },

  async updateAvailability(id, available) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const itemIndex = menuItems.findIndex(item => item.Id === parseInt(id));
    if (itemIndex !== -1) {
      menuItems[itemIndex] = { ...menuItems[itemIndex], available };
      return { ...menuItems[itemIndex] };
    }
    return null;
  },

  async create(itemData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const maxId = Math.max(...menuItems.map(item => item.Id), 0);
    const newItem = {
      Id: maxId + 1,
      ...itemData
    };
    menuItems.push(newItem);
    return { ...newItem };
  },

  async update(id, itemData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const itemIndex = menuItems.findIndex(item => item.Id === parseInt(id));
    if (itemIndex !== -1) {
      menuItems[itemIndex] = { ...menuItems[itemIndex], ...itemData };
      return { ...menuItems[itemIndex] };
    }
    return null;
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const itemIndex = menuItems.findIndex(item => item.Id === parseInt(id));
    if (itemIndex !== -1) {
      const deletedItem = menuItems.splice(itemIndex, 1)[0];
      return { ...deletedItem };
    }
    return null;
  },

  async getCategories() {
    await new Promise(resolve => setTimeout(resolve, 200));
    const categories = [...new Set(menuItems.map(item => item.category))];
    return categories.sort();
  }
};

export default menuService;