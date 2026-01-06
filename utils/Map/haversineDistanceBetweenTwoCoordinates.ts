// Define a type for latitude/longitude values
type DegreeValue = number;

const toRad = (value: DegreeValue): number => (value * Math.PI) / 180;

// Import the helper function (or define it in the same file)
// const toRad = (value: DegreeValue): number => (value * Math.PI) / 180;
const EARTH_RADIUS_KM: number = 6371;

/**
 * Calculates the great-circle distance between two points (lat/lon) on Earth
 * using the Haversine formula.
 * @param lat1 Latitude of the first point.
 * @param lon1 Longitude of the first point.
 * @param lat2 Latitude of the second point.
 * @param lon2 Longitude of the second point.
 * @returns The distance between the two coordinates, in meters, as a string rounded to 1 decimal place.
 */
const haversineDistanceBetweenTwoCoordinates = (
  lat1: DegreeValue,
  lon1: DegreeValue,
  lat2: DegreeValue,
  lon2: DegreeValue
): string => { // Returns a string (due to .toFixed(1))

  // Convert differences to radians
  const dLat: number = toRad(lat2 - lat1);
  const dLon: number = toRad(lon2 - lon1);

  // Convert latitudes to radians
  const radLat1: number = toRad(lat1);
  const radLat2: number = toRad(lat2);

  // Haversine formula core calculation (a)
  const a: number =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) ** 2;

  // Angular distance in radians (c)
  const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Final distance calculation: Distance = R * c
  // (6371 km * c * 1000 m/km)
  const distanceMeters: number = EARTH_RADIUS_KM * c * 1000;

  // Return the distance as a string, rounded to one decimal place
  return distanceMeters.toFixed(1);
};

export default haversineDistanceBetweenTwoCoordinates;
