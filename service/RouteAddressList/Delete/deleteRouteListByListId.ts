import { handleApiError } from '../../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
type ListId = string;
type UserId = string;
type SuccessResponseText = string;
// ---

const deleteRouteListByListId = async (
  list_id: ListId, // Explicitly type the address list ID
  user_id: UserId, // Explicitly type the user ID
): Promise<SuccessResponseText | undefined> => {
  // Returns response text or undefined

  try {
    const response: Response = await fetch(
      `${API_BASE_URL}/api/v1/route-address-list/deleteList?list_id=${list_id}&user_id=${user_id}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      },
    );

    // Read response text explicitly (can be success message or API error details)
    const responseText: string = await response.text();

    if (response.ok) {
      // Return the raw response body text on success
      return responseText;
    }

    // If not successful but no network error occurred
    // You may want to handle the error message in responseText here
    console.error(
      `Failed to delete list (Status: ${response.status}): ${responseText}`,
    );
    return undefined;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default deleteRouteListByListId;
