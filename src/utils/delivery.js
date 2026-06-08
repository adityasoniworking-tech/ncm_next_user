// Configuration & Default Shop Location
export const SHOP_LOCATION = [
    parseFloat(process.env.NEXT_PUBLIC_MAP_SHOP_LAT || '23.1917174'),
    parseFloat(process.env.NEXT_PUBLIC_MAP_SHOP_LNG || '72.6213802')
]; // nuttychocomorsels base

export const DELIVERY_CONFIG = {
    firstKmFree: true,
    chargePerIncrement: 5,
    minChargeDistance: 1.0,
    incrementDistance: 0.5
};

// Haversine Distance Calculator
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
