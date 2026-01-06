import { handleApiError } from '../../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
type UserId = string;

interface RouteListItem {
  id: string;
  list_name: string;
  createdAt: string;
  user_id: string;
}
// ---

const getUserAddressList = async (
  userid: UserId, // Explicitly type the input user ID
): Promise<RouteListItem[]> => {
  // Returns an array of lists or undefined/throws

  try {
    const response: Response = await fetch(
      `${API_BASE_URL}/api/v1/route-address-list/getAllAddressList?user_id=${userid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    // Read the raw response text before checking response.ok
    const text: string = await response.text();

    // Check if response is OK (HTTP status 200-299)
    if (response.ok) {
      // Attempt to parse the JSON and cast it to the expected type

      return JSON.parse(text);
    }

    // Log the failure reason if response is not ok
    console.error(
      `Failed to fetch address lists. Status: ${response.status}. Body: ${text}`,
    );
    return [];
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default getUserAddressList;
