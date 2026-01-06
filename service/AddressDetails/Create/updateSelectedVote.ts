import { handleApiError } from '../../../utils/apiErrorHandler';
import { ReviewType } from '../../../types/enums/ReviewType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;


// --- Type Definitions (Imported or Defined Here) ---
interface VotePayload {
  reviewType: ReviewType;
  address_id: string;
  user_id: string;
}

interface VoteUpdateResponse {
  success: boolean;
  message: string;
  // Add other fields your backend returns
}
// ---

const updateSelectedVote = async (
  addressId: string, // Explicitly type the input
  selectedVote: ReviewType, // Explicitly type the input
  userId: string, // Explicitly type the input
): Promise<void> => {
  // The function returns a promise resolving to the response data

  // Construct the payload object with type safety
  const payload: VotePayload = {
    reviewType: Number(selectedVote),
    address_id: addressId,
    user_id: userId,
  };

  try {
    const url = `${API_BASE_URL}/api/v1/address-details/updateSelectedVote`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // 1. Check for non-2xx status codes (fetch does not throw on 4xx/5xx)
    if (!response.ok) {
      // Read the body, which might contain the error message
      const errorBody: VoteUpdateResponse = await response.json();
      throw new Error(
        errorBody.message || `Request failed with status ${response.status}`,
      );
    }
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default updateSelectedVote;
