import axios, {AxiosError, AxiosResponse } from 'axios';
import { handleApiError } from '../../../utils/apiErrorHandler';
import { RatingAddressItemComplete } from '../../../types/RatingAddress/RatingAddressType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface ApiErrorResponse {
  _embedded?: {
    errors?: Array<{ message: string }>;
  };
  message?: string; // optional fallback
}

const getRatingAddress = async (
  addressId: string, // Explicitly type the input address ID
): Promise<RatingAddressItemComplete | undefined> => {
  // Type the return promise to be AddressRating OR null

  try {
    // Use Generics: <AddressRating> tells TypeScript the structure of response.data
    const response: AxiosResponse<RatingAddressItemComplete> = await axios.get(
      `${API_BASE_URL}/api/v1/rating/address/getRatingAddress?address_id=${addressId}`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.status === 200) {
      // TypeScript knows response.data is AddressRating
      return response.data;
    }

  } catch (error) {
    const axiosError = error as AxiosError;

    // 2. Safely cast the response data to your defined error structure
    const errorData = axiosError.response?.data as ApiErrorResponse | undefined;


    // 3. Safely access the nested message using the typed structure
    // This uses optional chaining '?' extensively to prevent TS2339 errors.
    const errorMsg: string | undefined =
        errorData?._embedded?.errors?.[0]?.message;

    // 4. Preserve the custom error handling logic: return [] if message is empty/null/undefined
    if (errorMsg === undefined || errorMsg === null || errorMsg === '' || errorMsg === 'Page Not Found') {
      // This likely covers a 'route not found' scenario (e.g., previous 404 check)
      // where the API might return an empty/malformed error body.
      return undefined;
    }

  }
};
export default getRatingAddress;
