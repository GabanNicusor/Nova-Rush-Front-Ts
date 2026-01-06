
import polyline from '@mapbox/polyline';
import { handleApiError } from '../../utils/apiErrorHandler';

const API_OSM_URL = process.env.EXPO_PUBLIC_API_OSM_URL;

// --- 1. Core Types ---

// [longitude, latitude] array
type LngLat = [number, number];
// {latitude, longitude} object (used in the final output)
interface LatLng {
  latitude: number;
  longitude: number;
}
// Final normalized step object
interface RouteStep {
  maneuverType: string;
  modifierType: string;
  instruction: string;
  highway: boolean;
  location: LatLng;
  duration: number; // in seconds
  distance: number; // NOTE: Added distance to the final step object based on removeDuplicate usage
}

// --- 2. OSRM API Response Types ---

// OSRM maneuver object
interface OSRMManeuver {
  type: string;
  modifier?: string;
  location: LngLat; // [longitude, latitude]
}

// OSRM step object (used in the legs array)
interface OSRMStep {
  maneuver: OSRMManeuver;
  duration: number;
  distance: number; // Used by removeDuplicate
  name: string;
  mode: string;
  // The 'class' field appears to be an array or string based on original code, we'll assume string array
  class?: string[];
}

// OSRM leg object (an array of these is in routes[0])
interface OSRMLeg {
  steps: OSRMStep[];
  distance: number;
  duration: number;
}

// OSRM route object (data.routes[0])
interface OSRMRoute {
  geometry: string; // The polyline encoded string
  legs: OSRMLeg[];
  distance: number;
  duration: number;
}

// OSRM final response object
interface OSRMResponse {
  routes: OSRMRoute[];
  code: string; // 'Ok' or an error code
}

// --- 3. Final Output Type ---

interface FinalDirectionsResponse {
  fullPath: LatLng[];
  steps: RouteStep[];
}
// Utility function defined outside or exported
const removeDuplicate = (steps: RouteStep[]): RouteStep[] => {
  // Create a mutable copy since we are using splice
  const stepsCopy = [...steps];
  for (let i = 0; i <= stepsCopy.length - 2; i++) {
    // NOTE: The original logic relies on 'distance' being on the step object.
    // I have added 'distance' to the RouteStep interface.
    if (stepsCopy[i].distance === 0 && stepsCopy[i].duration === 0) {
      stepsCopy.splice(i, 1);
      i--; // Adjust index after removal
    }
  }
  return stepsCopy;
};

// Function to generate a full instruction text
const generateInstruction = (
  maneuverType: string,
  modifierType: string,
): string => {
  const action =
    {
      turn: `Turn ${modifierType}`,
      'new name': `Continue on the road`,
      depart: `Start your journey`,
      arrive: `You have arrived at your destination`,
      merge: `Merge ${modifierType}`,
      ramp: `Take the ${modifierType} ramp`,
      fork: `Keep ${modifierType} at the fork`,
      roundabout: `Enter the roundabout and take the exit`,
      'exit roundabout': `Exit the roundabout`,
      'u-turn': `Make a U-turn`,
    }[maneuverType] || `Proceed ${modifierType}`;

  return `${action}`;
};

export const fetchOSRMDirections = async (
  coordinates: LngLat[], // The input is an array of [longitude, latitude] arrays
): Promise<FinalDirectionsResponse> => {
  try {
    const coordinatesString = coordinates
      .map(([longitude, latitude]) => `${longitude},${latitude}`)
      .join(';');

    const response = await fetch(
      `${API_OSM_URL}/route/v1/driving/${coordinatesString}?overview=full&steps=true`,
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `OSRM API request failed: ${response.status} - ${errorText}`,
      );
    }

    // Explicitly type the response data
    const data: OSRMResponse = await response.json();

    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
      throw new Error(`OSRM routing failed: ${data.code}`);
    }

    // Decode polyline geometry to extract the full path
    const encodedGeometry = data.routes[0].geometry;
    // polyline.decode returns an array of [latitude, longitude] arrays
    const decodedCoordinates: [number, number][] =
      polyline.decode(encodedGeometry);

    // Map to the required {latitude, longitude} object format
    const fullPath: LatLng[] = decodedCoordinates.map(coords => ({
      latitude: coords[0], // lat
      longitude: coords[1], // lon
    }));

    // Extract and normalize turn-by-turn directions from the steps array
    const steps: RouteStep[] = data.routes[0].legs.flatMap(leg =>
      leg.steps.map(step => {
        const maneuverType = step.maneuver.type || 'continue';
        const modifierType = step.maneuver.modifier || 'straight';
        const instruction = generateInstruction(maneuverType, modifierType);

        return {
          maneuverType,
          modifierType,
          instruction,
          // Check if step.class exists and includes 'highway'
          highway: step.class ? step.class.includes('highway') : false,
          location: {
            latitude: step.maneuver.location[1], // lat (second element in OSRM LngLat)
            longitude: step.maneuver.location[0], // lon (first element in OSRM LngLat)
          },
          duration: step.duration,
          distance: step.distance, // Required for removeDuplicate
        };
      }),
    );

    // Remove duplicates and return the final structure
    const nonDuplicateSteps = removeDuplicate(steps);

    return {
      fullPath,
      steps: nonDuplicateSteps,
    };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default fetchOSRMDirections;
