// 1. Basic Coordinate structure used throughout the app
export interface LatLng {
  latitude: number;
  longitude: number;
}

// 2. The structure for an individual navigation step
export interface RouteStep {
  maneuverType: string;
  modifierType: string;
  instruction: string;
  highway: boolean;
  location: LatLng;
  duration: number;
}

// 3. The final object returned by fetchOSRMDirections
export interface ORSMDirectionsType {
  fullPath: LatLng[];
  steps: RouteStep[];
}
