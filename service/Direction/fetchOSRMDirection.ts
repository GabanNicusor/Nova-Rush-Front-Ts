import polyline from '@mapbox/polyline';
import {handleApiError} from '@/utils/apiErrorHandler';

const API_OSM_URL = process.env.EXPO_PUBLIC_API_OSM_URL;

type LngLat = [number, number];

interface LatLng {
    latitude: number;
    longitude: number;
}

interface RouteStep {
    maneuverType: string;
    modifierType: string;
    instruction: string;
    highway: boolean;
    location: LatLng;
    duration: number;
    distance: number;
}

interface OSRMManeuver {
    type: string;
    modifier?: string;
    location: LngLat;
}

interface OSRMStep {
    maneuver: OSRMManeuver;
    duration: number;
    distance: number;
    name: string;
    mode: string;
    class?: string[];
}

interface OSRMLeg {
    steps: OSRMStep[];
    distance: number;
    duration: number;
}

interface OSRMRoute {
    geometry: string;
    legs: OSRMLeg[];
    distance: number;
    duration: number;
}

interface OSRMResponse {
    routes: OSRMRoute[];
    code: string;
}


interface FinalDirectionsResponse {
    fullPath: LatLng[];
    steps: RouteStep[];
}

const removeDuplicate = (steps: RouteStep[]): RouteStep[] => {
    const stepsCopy = [...steps];

    for (let i = 0; i <= stepsCopy.length - 2; i++) {
        if (stepsCopy[i].distance === 0 && stepsCopy[i].duration === 0) {
            stepsCopy.splice(i, 1);
            i--;
        }
    }
    return stepsCopy;
};

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

export  async function  fetchOSRMDirections  (
    coordinates: LngLat[],
): Promise<FinalDirectionsResponse> {
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

        const data: OSRMResponse = await response.json();

        if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
            throw new Error(`OSRM routing failed: ${data.code}`);
        }

        const encodedGeometry = data.routes[0].geometry;

        const decodedCoordinates: [number, number][] =
            polyline.decode(encodedGeometry);

        const fullPath: LatLng[] = decodedCoordinates.map(coords => ({
            latitude: coords[0], // lat
            longitude: coords[1], // lon
        }));

        const steps: RouteStep[] = data.routes[0].legs.flatMap(leg =>
            leg.steps.map(step => {
                const maneuverType = step.maneuver.type || 'continue';
                const modifierType = step.maneuver.modifier || 'straight';
                const instruction = generateInstruction(maneuverType, modifierType);

                return {
                    maneuverType,
                    modifierType,
                    instruction,

                    highway: step.class ? step.class.includes('highway') : false,
                    location: {
                        latitude: step.maneuver.location[1],
                        longitude: step.maneuver.location[0],
                    },
                    duration: step.duration,
                    distance: step.distance,
                };
            }),
        );

        const nonDuplicateSteps = removeDuplicate(steps);

        return {
            fullPath,
            steps: nonDuplicateSteps,
        };
    } catch (error) {
        handleApiError(error);
        throw error;
    }
}
