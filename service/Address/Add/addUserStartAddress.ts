import { handleApiError } from '../../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions ---
interface SetStartAddressPayload {
  user_id: string; // Use string if IDs are strings (e.g., UUIDs)
  address_id: string;
}

type SetStartAddressResponse = string | void;

// --- The Converted Function ---

const addUserStartAddress = async (
  userId: string, // Added type annotation
  addressId: string // Added type annotation
): Promise<SetStartAddressResponse> => { // Added return type annotation

  // Type check the payload
  const payload: SetStartAddressPayload = {
    user_id: userId,
    address_id: addressId,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/address/starting-address`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      // The method is complete and returns a Promise resolving to a string
      return await response.text();
    }

    // If response is not ok (e.g., 400, 500, etc.), nothing is explicitly returned here,
    // so the function implicitly returns 'undefined' (which matches the 'void' part of the return type).
    // A better pattern for error handling is usually to check the status and throw an error
    // if response is not ok, but we stick to the original function logic.

  } catch (error) {
    // Assuming handleApiError is correctly typed to accept 'unknown' or 'Error'
    handleApiError(error);

    // Re-throw the error so the calling function can handle the failure
    throw error;
  }
};

export default addUserStartAddress;
