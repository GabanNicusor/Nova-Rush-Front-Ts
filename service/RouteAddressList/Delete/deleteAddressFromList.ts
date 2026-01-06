import { handleApiError } from '../../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
type ListId = string;
type AddressId = string;
// ---

const deleteAddressFromList = async (
  list_id: ListId, // Explicitly type the address list ID
  address_id: AddressId, // Explicitly type the address ID
): Promise<boolean | undefined> => {
  // Returns boolean (response.ok) or undefined

  try {
    const response: Response = await fetch(
      `${API_BASE_URL}/api/v1/route-address-list/deleteAddress?list_id=${list_id}&address_id=${address_id}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.status === 200) {
      // Return true if the deletion was successful (HTTP 200)
      return response.ok;
    }

    // If status is not 200 (e.g., 404 Not Found, 403 Forbidden), return undefined
    return undefined;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default deleteAddressFromList;
