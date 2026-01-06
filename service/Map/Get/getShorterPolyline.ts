// Service
import GetUserId from '../../User/Get/getUserId';
import {createOrUpdateRoutePath} from '../../../service/Map/Create/createOrUpdateRoutePath';

import polyline from '@mapbox/polyline';
import { handleApiError } from '../../../utils/apiErrorHandler';

// --- Type Definitions (Imported or Defined Here) ---
type NodeIndex = number;
type RouteId = string;
// ---

interface Coordinate {
  latitude: number;
  longitude: number;
  accuracy: boolean;
}

const getShorterPolyline = async (
  polylineNodes: Coordinate[], // Explicitly type the input array of coordinates
  currentNode: NodeIndex, // Explicitly type the current node index
  addressListId: RouteId, // Explicitly type the route ID
): Promise<Coordinate[]> => {
  // The function returns the clipped array of coordinates

  try {
    // Slice polyline nodes from the current node to the end
    // The result is an array of coordinates, maintaining the PolylineNodes type
    const clippedPolylineNodes: Coordinate[] =
      polylineNodes.slice(currentNode);

    // Get user ID
    const user_id: string = await GetUserId();

    // Polyline.encode expects PolylineNodes and returns a string
    await createOrUpdateRoutePath(
        polyline.encode(
            clippedPolylineNodes.map(coordinates => [coordinates.latitude, coordinates.longitude] as [number, number])
        ), // Encoded clipped polyline string
      [], // Empty stop order array (string[])
      user_id, // User ID string
      addressListId, // Route ID string
    );

    return clippedPolylineNodes;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default getShorterPolyline;
