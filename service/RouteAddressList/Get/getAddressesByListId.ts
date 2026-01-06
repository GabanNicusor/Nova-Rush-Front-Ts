import axios, { AxiosResponse, AxiosError } from 'axios';
import { handleApiError } from '../../../utils/apiErrorHandler';
import { AddressItemComplete } from '../../../types/Address/AddressType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
interface ApiErrorResponse {
  _embedded?: {
    errors?: Array<{ message: string }>;
  };
}
// ---

const getAddressesByListId = async (
  addressListId: string | null, // Explicitly type the input list ID
): Promise<AddressItemComplete[]> => {
  // Returns a promise resolving to an array of AddressItem (or empty array)

  try {
    // Use Generics: <AddressItem[]> tells TypeScript the structure of response.data
    const response: AxiosResponse<AddressItemComplete[]> = await axios.get(
      `${API_BASE_URL}/api/v1/address/address-lists/addresses?addresses_list_id=${addressListId}`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    // Axios throws an error for 4xx/5xx, so we only need to check for 200 here
    if (response.status === 200) {
      return response.data;
    }

    // Should be unreachable if the API is configured correctly, but good for safety
    return [];
  } catch (error) {
    const axiosError = error as AxiosError;

    // 2. Safely cast the response data to your defined error structure
    const errorData = axiosError.response?.data as ApiErrorResponse | undefined;

    // 3. Safely access the nested message using the typed structure
    const errorMsg = errorData?._embedded?.errors?.[0]?.message;

    if (errorMsg === 'Route not found.') {
      // If the specific "not found" error is caught, return an empty array
      return [];
    } else {
      // For all other errors (network issues, unexpected server errors)
      handleApiError(error);
      throw error;
    }
  }
};

export default getAddressesByListId;
