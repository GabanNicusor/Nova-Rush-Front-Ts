import { handleApiError } from '../../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
type RouteId = string;

interface UpdateResult {
  success: boolean;
}
// ---

const updateAllNewStops = async (
  routeId: RouteId, // Explicitly type the input route ID
): Promise<UpdateResult> => {
  // The function returns an object with a success status

  try {
    const response: Response = await fetch(
      `${API_BASE_URL}/api/v1/route/setAllNewStopFalse?route_id=${routeId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    // Check if the response was successful (HTTP status 200-299)
    if (response.ok) {
      // Return success object on HTTP success
      return { success: true };
    }

    // --- IMPORTANT NOTE ---
    // The original JS code returned { success: true } here even if response.ok was false.
    // This is unusual for an API call, but we preserve the behavior.
    // If the intent was to return { success: false } on a bad HTTP status,
    // you should change the next line to: return { success: false };
    console.warn(
      `API call succeeded but returned non-OK status: ${response.status}`,
    );
    return { success: true };
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default updateAllNewStops;
