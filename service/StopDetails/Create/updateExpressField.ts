import { handleApiError } from '../../../utils/apiErrorHandler';
import { ExpressType } from '../../../types/enums/ExpressType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
type UserId = string;
type AddressId = string;
type ListId = string;

interface ExpressPayload {
  user_id: UserId;
  address_id: AddressId;
  address_list_id: ListId;
  expressType: ExpressType;
}

interface UpdateSuccessResponse {
  success: boolean;
  message: string;
}
// ---

const updateExpressField = async (
  userId: UserId, // Explicitly type the user ID
  addressId: AddressId, // Explicitly type the address ID
  addressListId: ListId, // Explicitly type the address list ID
  expressType: ExpressType, // Explicitly type the express type
): Promise<UpdateSuccessResponse | undefined> => {
  // Returns the parsed JSON response or undefined/throws

  // 1. Construct the payload object with type safety
  const payload: ExpressPayload = {
    user_id: userId,
    address_id: addressId,
    address_list_id: addressListId,
    expressType: Number(expressType),
  };

  try {
    const response: Response = await fetch(
      `${API_BASE_URL}/api/v1/stop-details/updateExpressType`,
      {
        method: 'POST', // Note: A PUT request might be semantically better for an update
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    // Check if the response was successful (HTTP status 200-299)
    if (response.ok) {
      return {
        success: true,
        message: "Updated successfully",
      };
    }

    // If not successful but no network error occurred
    console.error(`Failed to update express type. Status: ${response.status}`);
    return undefined;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
export default updateExpressField;
