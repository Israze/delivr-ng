/**
 * Haversine formula — calculates straight-line distance
 * between two coordinates in kilometers
 */
const getDistanceInKm = (coord1, coord2) => {
  const R = 6371; // Earth's radius in km

  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(coord2.lat - coord1.lat);
  const dLng = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return parseFloat((R * c).toFixed(2));
};

/**
 * Find area coordinates from cities data by area name and city id
 */
const findAreaCoordinates = (cities, cityId, areaName) => {
  const city = cities.find((c) => c.id === cityId);
  if (!city) return null;

  const area = city.areas.find(
    (a) => a.name.toLowerCase() === areaName.toLowerCase()
  );
  return area ? area.coordinates : null;
};

/**
 * Find zone surcharge for a given area in a city
 */
const getZoneSurcharge = (zones, cityId, areaName) => {
  const zone = zones.find(
    (z) =>
      z.city === cityId &&
      z.areas.map((a) => a.toLowerCase()).includes(areaName.toLowerCase())
  );
  return zone ? zone.surcharge : 0;
};

module.exports = { getDistanceInKm, findAreaCoordinates, getZoneSurcharge };