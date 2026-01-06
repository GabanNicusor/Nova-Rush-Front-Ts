import { AppDispatch } from '../../../state/store';
import {
  setDirectionSteps,
  setMarkers,
  setPolylineCoordsList,
} from '../../../state/navSlice';
import { handleApiError } from '../../../utils/apiErrorHandler';

// Service

import createMarkers from '../../../utils/Map/createMarkers';
import fetchOSRMDirections from '../../Direction/fetchOSRMDirection';
import { AddressItemComplete } from '../../../types/Address/AddressType';
import {
  ORSMDirectionsType,
  RouteStep,
} from '../../../types/OpenRouteService/ORSManeuversType';

// --- Core Types ---

// 1. A single coordinate object (used for final polyline/marker structure)
interface LatLng {
  latitude: number;
  longitude: number;
}

// 2. An OSRM coordinate array [longitude, latitude]
type LngLatArray = [number, number];





const chunkWaypoints = (
  waypoints: LngLatArray[],
  chunkSize: number,
): LngLatArray[][] => {
  const chunks: LngLatArray[][] = [];
  // Slice logic adjusted to account for the -1 offset in the main function's logic
  for (let i = 0; i < waypoints.length; i += chunkSize - 1) {
    chunks.push(waypoints.slice(i, i + chunkSize));
  }
  return chunks;
};

const removeDiscontinuities = (coords: LatLng[]): LatLng[] => {
  // Ensure we start with a copy or the first element
  let cleanedCoords: LatLng[] = coords.length > 0 ? [coords[0]] : [];

  for (let i = 1; i < coords.length; i++) {
    const prev = cleanedCoords[cleanedCoords.length - 1];
    const curr = coords[i];

    // Compare latitude and longitude for uniqueness
    if (prev.latitude !== curr.latitude || prev.longitude !== curr.longitude) {
      cleanedCoords.push(curr);
    }
  }
  return cleanedCoords;
};

export const postCalculateAndDisplayRoute = async (
  address: AddressItemComplete[], // The array of addresses including coordinates
  dispatch: AppDispatch, // The Redux dispatch function
): Promise<void> => {
  // Minimum check for a route (origin and destination)
  if (address.length < 2) {
    console.warn(
      'Route requires at least two addresses (origin and destination).',
    );
    return;
  }
  // 1. Prepare coordinates for OSRM format [longitude, latitude]
  const origin: LngLatArray = [address[0].longitude, address[0].latitude];
  const destination: LngLatArray = [
    address[address.length - 1].longitude,
    address[address.length - 1].latitude,
  ];

  // Intermediate stops (waypoints)
  const waypoints: LngLatArray[] = address
    .slice(1, -1)
    .map(({ latitude, longitude }) => [longitude, latitude]);

  // 2. Chunk waypoints for OSRM API limit (48 max per request)
  const waypointChunks: LngLatArray[][] = chunkWaypoints(waypoints, 48);

  let allCoords: LatLng[] = [];
  let currentOrigin: LngLatArray = origin;
  let allSteps: RouteStep[] = [];

  try {
    // 3. Loop through chunks to build the full route
    for (let i = 0; i < waypointChunks.length; i++) {
      const chunk = waypointChunks[i];
      const isLastChunk = i === waypointChunks.length - 1;

      // The destination for the current chunk is either the last waypoint of the chunk
      // OR the final destination of the entire route if it's the last chunk.
      const chunkDestination: LngLatArray = isLastChunk
        ? destination
        : chunk[chunk.length - 1];

      // Create the list of coordinates for this specific OSRM call
      const coordinatesToFetch: LngLatArray[] = [currentOrigin, ...chunk];
      if (isLastChunk || chunk.length < 48 - 1) {
        // Only add destination if it's the final stop or if the chunk is full and the next waypoint becomes the destination
        coordinatesToFetch.push(chunkDestination);
      }

      // Fetch directions and ensure the response is typed
      const response: ORSMDirectionsType = await fetchOSRMDirections(
        coordinatesToFetch,
      );

      // CORRECT: Concat the arrays INSIDE the response
      allCoords = allCoords.concat(response.fullPath);
      allSteps = allSteps.concat(response.steps);

      currentOrigin = chunkDestination;
    }

    // 4. Clean up and Dispatch results
    allCoords = removeDiscontinuities(allCoords);

    // Dispatch to Redux
    // @ts-ignore
    dispatch(setPolylineCoordsList(allCoords));
    dispatch(setDirectionSteps(allSteps));

    // createMarkers expects the original address list structure
    dispatch(setMarkers(createMarkers(address)));
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default postCalculateAndDisplayRoute;
