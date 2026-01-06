import { fetch } from 'expo/fetch';
import { handleApiError } from '../../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
type ListId = string;
// ---

const deleteAllStopDetails = async (
  listId: ListId, // Explicitly type the input list ID
): Promise<boolean | undefined> => {
  // Returns boolean (response.ok) or undefined

  try {
    const response: Response = await fetch(
      `${API_BASE_URL}/api/v1/stop-details/deleteAllStopDetails?list_id=${listId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status === 200) {
      // Return true if the deletion was successful (HTTP 200)
      return response.ok;
    }

    // Log non-200 status (e.g., 404, 403) and return undefined
    console.warn(
      `Failed to delete stop details for list ${listId}. Status: ${response.status}`,
    );
    return undefined;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default deleteAllStopDetails;
