import * as Location from 'expo-location';
import { LocationPermissionResponse } from 'expo-location'; // For the response object

// --- Type Definitions (Imported or Defined Here) ---
interface LocationCoords {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}
// ---

export default class LocationService {
  // Renamed to PascalCase for class convention

  static async getCurrentLocation(): Promise<LocationCoords | undefined> {
    // Explicitly type the permission response object
    const { status }: LocationPermissionResponse =
      await Location.requestForegroundPermissionsAsync();

    // Check status against the required string literal 'granted'
    if (status !== 'granted') {
      console.warn('Location permission not granted.');
      return undefined; // Return undefined if permission is denied
    }

    // Location.getCurrentPositionAsync returns a Location.LocationObject
    const location: Location.LocationObject =
      await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

    // TypeScript now knows location.coords matches the LocationCoords interface
    return location.coords;
  }
}
