import { handleApiError } from '../../../utils/apiErrorHandler';
import { StopOrderItem } from '../../../types/StopOrder/StopOrder';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---

// Interface for the data sent in the request body
interface UpdateRoutePayload {
  stop_order: StopOrderItem[]; // The array defining the new order
  route_id: string;
}
// ---

const updateRouteAddressList = async (
  addresses: StopOrderItem[], // Explicitly type the array of addresses defining the new order
  routeId: string, // Explicitly type the route ID
): Promise<boolean | undefined> => {
  // Returns a boolean (response.ok) or undefined/throws

  // 1. Construct the payload object with type safety
  const payload: UpdateRoutePayload = {
    stop_order: addresses,
    route_id: routeId,
  };

  try {
    const response: Response = await fetch(
      `${API_BASE_URL}/api/v1/route-address-list/updateRouteListAddresses`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    if (response.status === 200) {
      // response.ok returns a boolean (true for status 200-299)
      // Even though you checked status 200, response.ok is cleaner for 2xx range
      return response.ok;
    }

    // If status is not 200, but no network error occurred
    console.warn(`Failed to update route list. Status: ${response.status}`);
    return undefined;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default updateRouteAddressList;
