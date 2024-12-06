const storesLocation = require('../models/storesLocation');

// Haversine formula to calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

async function findNearestStore(userLat, userLon) {
  const stores = await storesLocation.find();
  let nearestStore = null;
  let shortestDistance = Infinity;

  stores.forEach(store => {
    const distance = calculateDistance(userLat, userLon, store.latitude, store.longitude);
    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestStore = store;
    }
  });

  return nearestStore;
}

async function getAllStores() {
    try {
        const stores = await storesLocation.find();
        return stores;
    } catch (error) {
        throw new Error('Error fetching stores');
    }
}

module.exports = {
  getAllStores,
  findNearestStore,
};
