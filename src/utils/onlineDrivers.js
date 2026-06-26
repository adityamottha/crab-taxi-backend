// Simple in-memory store for online drivers
// For production, consider using Redis
export const onlineDrivers = new Map();

// Helper functions
export const driverManager = {
  addDriver: (userId, socketId) => {
    onlineDrivers.set(userId, socketId);
    return true;
  },
  removeDriver: (userId) => {
    return onlineDrivers.delete(userId);
  },
  getDriverSocket: (userId) => {
    return onlineDrivers.get(userId);
  },
  isDriverOnline: (userId) => {
    return onlineDrivers.has(userId);
  },
  getAllOnlineDrivers: () => {
    return [...onlineDrivers.keys()];
  },
  getOnlineDriversCount: () => {
    return onlineDrivers.size;
  }
};
