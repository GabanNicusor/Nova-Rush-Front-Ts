import { handleApiError } from '../../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
interface AddressPayload {
  address_list_id: string;
  address_complete: string;
  latitude: number;
  longitude: number;
}
// ---

const addAddressToList = async (
  addressComplete: string, // Explicitly type the full address string
  latitude: number, // Explicitly type the latitude number
  longitude: number, // Explicitly type the longitude number
  addressListId: string | '', // Explicitly type the address list ID string
): Promise<string | undefined> => {
  // Returns a string (the response body text) or undefined

  // 1. Construct the payload object with type safety
  const payload: AddressPayload = {
    address_list_id: addressListId,
    address_complete: addressComplete,
    latitude: latitude,
    longitude: longitude,
  };

  try {
    const response: Response = await fetch(
      `${API_BASE_URL}/api/v1/address/address-lists/addresses`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    // Check if the response was successful (HTTP status 200-299)
    if (response.ok) {
      // Return the raw response body text
      return await response.text();
    }

    // If not successful but no network error
    // Optionally, throw an error or return a status message here for better error handling.
    console.warn(`Failed to add address, status: ${response.status}`);
    return undefined;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default addAddressToList;
