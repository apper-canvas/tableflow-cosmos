import tablesData from "@/services/mockData/tables.json";

let tables = [...tablesData];

const tableService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...tables];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const table = tables.find(table => table.Id === parseInt(id));
    return table ? { ...table } : null;
  },

  async updateStatus(id, status, partySize = null) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const tableIndex = tables.findIndex(table => table.Id === parseInt(id));
    if (tableIndex !== -1) {
      const updates = { status };
      if (partySize !== null) {
        updates.currentPartySize = partySize;
      }
      if (status === "available") {
        updates.currentPartySize = 0;
        updates.reservationTime = null;
      }
      tables[tableIndex] = { ...tables[tableIndex], ...updates };
      return { ...tables[tableIndex] };
    }
    return null;
  },

  async getByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return tables.filter(table => table.status === status).map(table => ({ ...table }));
  },

  async getAvailableTables() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return tables.filter(table => table.status === "available").map(table => ({ ...table }));
  },

  async reserveTable(id, reservationTime, partySize) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const tableIndex = tables.findIndex(table => table.Id === parseInt(id));
    if (tableIndex !== -1) {
      tables[tableIndex] = {
        ...tables[tableIndex],
        status: "reserved",
        reservationTime,
        currentPartySize: partySize
      };
      return { ...tables[tableIndex] };
    }
    return null;
  }
};

export default tableService;