import axios, {AxiosError, AxiosResponse} from 'axios';
import {handleApiError} from '../../../utils/apiErrorHandler';
import {StopDetailsType} from '../../../types/StopDetails/StopDetailsType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
type UserId = string;
type AddressId = string;

interface ApiErrorResponse {
    _embedded?: {
        errors?: Array<{ message: string }>;
    };
    message?: string; // optional fallback
}

const GetStopDetails = async (
    addressId: AddressId, // Explicitly type the address ID
    addressListId: string | null, // Explicitly type the address list ID
    userId: UserId, // Explicitly type the user ID
): Promise<StopDetailsType | undefined> => {
    // Returns the structured StopDetails or null on failure

    try {
        // Use Generics: <StopDetails> tells TypeScript the structure of response.data
        const response: AxiosResponse<StopDetailsType> = await axios.get(
            `${API_BASE_URL}/api/v1/stop-details/getStopDetails`,
            {
                headers: {'Content-Type': 'application/json'},
                params: {
                    address_id: addressId,
                    address_list_id: addressListId,
                    user_id: userId,
                },
            },
        );

        // Axios throws an error for 4xx/5xx, so if we reach here, status is 2xx
        if (response.status === 200) {
            return response.data;
        }
        // Should be unreachable under normal circumstances, but return null for safety
        return undefined;
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
export default GetStopDetails;
