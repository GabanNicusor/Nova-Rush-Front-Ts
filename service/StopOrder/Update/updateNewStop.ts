import { handleApiError } from '../../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
type RouteId = string;
type AddressId = string;

interface UpdateResult {
  success: boolean;
}
// ---

const updateNewStop = async (
  routeId: RouteId, // Explicitly type the input route ID
  addressId: AddressId, // Explicitly type the input address ID
): Promise<UpdateResult | undefined> => {
  // The function returns an object with a success status

  try {
    const response: Response = await fetch(
      `${API_BASE_URL}/api/v1/route/setNewStopFalse?route_id=${routeId}&address_id=${addressId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    // Check if the response was successful (HTTP status 200-299) or 204 (No Content)
    if (response.ok || response.status === 204 || response.status === 200) {
      return {success: true};
    }

  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default updateNewStop;
