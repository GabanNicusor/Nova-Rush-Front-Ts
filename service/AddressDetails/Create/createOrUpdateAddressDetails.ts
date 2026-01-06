import { handleApiError } from '../../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
// Assuming all IDs and text fields are strings, including the phone number 'number'
interface AddressDetailsPayload {
  user_id: string;
  address_id: string;
  name: string;
  number: string;
  notes: string;
}
// ---

const createOrUpdateAddressDetails = async (
  userId: string, // Explicitly type the input
  addressId: string, // Explicitly type the input
  name: string, // Explicitly type the input
  number: string, // Explicitly type the input
  notes: string, // Explicitly type the input
): Promise<void> => {
  // The function is async and returns nothing (void)

  // Construct the payload object with type safety
  const payload: AddressDetailsPayload = {
    user_id: userId,
    address_id: addressId,
    name: name,
    number: number,
    notes: notes,
  };

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/address-details/createOrUpdateAddressDetails`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    // Optional: Check response status for success/failure
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `API request failed with status ${response.status}: ${errorBody}`,
      );
    }
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default createOrUpdateAddressDetails;
