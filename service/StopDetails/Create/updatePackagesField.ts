import { handleApiError } from '../../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
type UserId = string;
type AddressId = string;
type ListId = string;
type PackagesCount = number;

interface PackagesPayload {
  user_id: UserId;
  address_id: AddressId;
  address_list_id: ListId;
  packages: PackagesCount;
}


const updatePackages = async (
  userId: UserId,
  addressId: AddressId,
  addressListId: ListId,
  packages: PackagesCount,
): Promise<void> => {
  // Returns the parsed JSON response or undefined/throws

  // 1. Construct the payload object with type safety
  const payload: PackagesPayload = {
    user_id: userId,
    address_id: addressId,
    address_list_id: addressListId,
    packages: packages,
  };

  try {
    const response: Response = await fetch(
      `${API_BASE_URL}/api/v1/stop-details/updatePackages`,
      {
        method: 'POST', // Note: A PUT request might be semantically better for an update
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    // Check if the response was successful (HTTP status 200-299)
    if (response.ok) {
      // Return the parsed JSON response, cast to the expected type

      return await response.json();
    }

    // If not successful but no network error occurred
    console.error(
      `Failed to update packages count. Status: ${response.status}`,
    );
    return undefined;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
export default updatePackages;
