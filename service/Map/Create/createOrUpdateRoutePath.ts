import { handleApiError } from '../../../utils/apiErrorHandler';
import { StopOrderItem } from '../../../types/StopOrder/StopOrder';
import { RoutePathItem } from '../../../types/RoutePath/RoutePathType'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
interface RoutePathPayload {
  polyline: string;
  stop_order: StopOrderItem[];
  user_id: string;
  route_id: string;
}
// ---

 export const createOrUpdateRoutePath = async (
  polyline: string, // Explicitly type the input
  stopOrder: StopOrderItem[], // Explicitly type the input array
  userId: string, // Explicitly type the input
  addressListId: string, // Explicitly type the input
): Promise<RoutePathItem | void> => {
  // The function is async and returns nothing (void)

  // 1. Construct the payload object with type safety
  const payload: RoutePathPayload = {
    polyline: polyline,
    stop_order: stopOrder,
    user_id: userId,
    route_id: addressListId,
  };

 try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/route-path/saveRoutePath`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload), // Using the strictly typed payload
      },
    );

    // Optional: Check response status for success/failure
    if (!response.ok) {
      // Throw an error if the server responded with a 4xx or 5xx status
      const errorBody = await response.text();
      throw new Error(
        `API request failed with status ${response.status}: ${errorBody}`,
      );
    }

  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

