import axios, { AxiosResponse, AxiosError } from 'axios';
import { RoutePathItem } from '../../../types/RoutePath/RoutePathType';
import {StopOrderItem } from '../../../types/StopOrder/StopOrder';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions ---
interface ApiErrorResponse {
  _embedded?: {
    errors?: Array<{ message: string }>;
  };
}
// ---

const getStopOrder = async (
  listId: string | null, // Explicitly type the input list ID
): Promise<StopOrderItem[] | undefined> => {
  // <<< CORRECTED RETURN TYPE: Array of objects

  try {
    // Use Generics: <StopOrderResponse> tells TypeScript the structure of response.data
    const response: AxiosResponse<RoutePathItem> = await axios.get(
      `${API_BASE_URL}/api/v1/route/getStopOrder?route_id=${listId}`,
      { headers: { 'Content-Type': 'application/json' } },
    );

    // Axios throws an error for 4xx/5xx, so if we reach here, status is 2xx
    if (response.status === 200) {
      // Returning the array of objects as expected by the new Promise type
      return response.data.stop_order;
    }

  } catch (error) {
    // 1. Cast the generic error to the standard AxiosError type
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
      return [];
    }
  }
};

export default getStopOrder;
