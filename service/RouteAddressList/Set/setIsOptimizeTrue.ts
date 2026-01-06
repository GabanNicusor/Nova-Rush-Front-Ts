import axios, { AxiosResponse } from 'axios';
import { handleApiError } from '../../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
type ListId = string;

interface UpdateStatusResponse {
  success: boolean;
  message: string;
  list_id: string;
}
// ---

const setIsOptimizeTrue = async (
  list_id: ListId, // Explicitly type the input list ID
): Promise<UpdateStatusResponse | undefined> => {
  // Returns the response data or undefined

  try {
    // Use Generics: <UpdateStatusResponse> tells TypeScript the structure of response.data
    const response: AxiosResponse<UpdateStatusResponse> = await axios.put(
      `${API_BASE_URL}/api/v1/route-address-list/setIsOptimizeTrue?list_id=${list_id}`,
      {}, // Empty body
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    // Axios throws an error for 4xx/5xx status codes
    if (response.status === 200) {
      return response.data;
    }

    // Should be unreachable if axios is configured correctly, but safe to return undefined
    return undefined;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default setIsOptimizeTrue;
