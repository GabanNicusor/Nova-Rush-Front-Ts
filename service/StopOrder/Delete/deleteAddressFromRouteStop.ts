import { handleApiError } from '../../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
type ListId = string;
type AddressId = string;
// ---

const deleteAddressFromRouteStop = async (
  list_id: ListId, // Explicitly type the address list ID
  address_id: AddressId, // Explicitly type the address ID
): Promise<boolean | undefined> => {
  // Returns boolean (response.ok) or undefined

  try {
    const response: Response = await fetch(
      `${API_BASE_URL}/api/v1/route/deleteAddressFromStopOrder?list_id=${list_id}&address_id=${address_id}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.status === 200) {
      // response.ok will be true for 2xx status codes
      return response.ok;
    }

    // Log non-200 status and return undefined
    console.warn(
      `Failed to delete address from stop order. Status: ${response.status}`,
    );
    return undefined;
  } catch (error) {
    console.error('deleteAddressFromRouteStop error:', error);
    handleApiError(error);
    throw error;
  }
};

export default deleteAddressFromRouteStop;
