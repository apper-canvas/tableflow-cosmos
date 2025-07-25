const tableService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "number_c" } },
          { field: { Name: "capacity_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "current_party_size_c" } },
          { field: { Name: "reservation_time_c" } }
        ],
        orderBy: [
          {
            fieldName: "number_c",
            sorttype: "ASC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('table_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tables:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "number_c" } },
          { field: { Name: "capacity_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "current_party_size_c" } },
          { field: { Name: "reservation_time_c" } }
        ]
      };

      const response = await apperClient.getRecordById('table_c', id, params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching table with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async updateStatus(id, status, partySize = null) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const updateData = {
        Id: parseInt(id),
        status_c: status
      };

      if (partySize !== null) {
        updateData.current_party_size_c = parseInt(partySize);
      }

      if (status === "available") {
        updateData.current_party_size_c = 0;
        updateData.reservation_time_c = null;
      }

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('table_c', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update table ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          return null;
        }

        const successfulUpdates = response.results.filter(result => result.success);
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating table status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async getByStatus(status) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "number_c" } },
          { field: { Name: "capacity_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "current_party_size_c" } },
          { field: { Name: "reservation_time_c" } }
        ],
        where: [
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: [status]
          }
        ],
        orderBy: [
          {
            fieldName: "number_c",
            sorttype: "ASC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('table_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching tables by status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getAvailableTables() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "number_c" } },
          { field: { Name: "capacity_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "current_party_size_c" } },
          { field: { Name: "reservation_time_c" } }
        ],
        where: [
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: ["available"]
          }
        ],
        orderBy: [
          {
            fieldName: "number_c",
            sorttype: "ASC"
          }
        ]
      };

      const response = await apperClient.fetchRecords('table_c', params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching available tables:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async reserveTable(id, reservationTime, partySize) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [
          {
            Id: parseInt(id),
            status_c: "reserved",
            reservation_time_c: reservationTime,
            current_party_size_c: parseInt(partySize)
          }
        ]
      };

      const response = await apperClient.updateRecord('table_c', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to reserve table ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          return null;
        }

        const successfulUpdates = response.results.filter(result => result.success);
        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error reserving table:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  }
};

export default tableService;