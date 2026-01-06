import { fetch } from 'expo/fetch';
import { handleApiError } from '../../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
type AddressId = string;
type ListId = string;
// ---

const deleteStopDetails = async (
  addressId: AddressId, // Explicitly type the address ID
  listId: ListId, // Explicitly type the address list ID
): Promise<boolean | undefined> => {
  // Returns boolean (response.ok) or undefined

  try {
    const response: Response = await fetch(
      `${API_BASE_URL}/api/v1/stop-details/deleteStopDetails?address_id=${addressId}&list_id=${listId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status === 200) {
      // response.ok will be true for 2xx status codes
      return response.ok;
    }

    // Log non-200 status and return undefined
    console.warn(
      `Failed to delete stop details for address ${addressId}. Status: ${response.status}`,
    );
    return undefined;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default deleteStopDetails;
