import axios, { AxiosResponse } from 'axios';
import { handleApiError } from '../../../utils/apiErrorHandler';

// Utils
import dispatchFirstListId from '../../../utils/User/dispatchFirstListId';

// Redux
import { AppDispatch } from '../../../state/store';
import { setAddressList } from '../../../state/navSlice'; // Assume setAddressList is a standard action creator

// Service
import getAddressStartId from '../../Address/Get/getAddressStartId';
import getUserId from '../../User/Get/getUserId';
import fetchFirstListId from '../../User/Fetch/fetchFirstListId';
import { AddressItemComplete } from '../../../types/Address/AddressType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
type UserId = string;
type ListId = string;

interface ShortestRouteResponse {
  route: AddressItemComplete[];
}
// ---

const getShortestRoute = async (
  addressListId: ListId | null, // Explicitly type the input list ID (or null)
  dispatch: AppDispatch, // Explicitly type the Redux dispatch function
): Promise<void> => {
  // The function returns a promise resolving to void (side effects only)

  try {
    // Fetch all necessary IDs
    const first_list_id: string = await fetchFirstListId();
    const user_id: UserId = await getUserId();
    // getAddressStartId returns the address object, not just the ID. We extract the ID.
    const startAddress = await getAddressStartId(user_id);
    const startAddressId: string = startAddress ?? '';

    if (addressListId === null) {
      // Note: dispatchFirstListId should be a separate utility typed to handle the dispatch argument.
      await dispatchFirstListId(first_list_id, dispatch);
    }

    // Determine which list ID to use for the API call
    const listIdToUse: string | null =
      addressListId === null ? first_list_id : addressListId;

    // Perform the API call
    const response: AxiosResponse<ShortestRouteResponse> = await axios.get(
      `${API_BASE_URL}/api/v1/route/shortest?list_id=${listIdToUse}&start_address_id=${startAddressId}&user_id=${user_id}`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    // Dispatch the fetched route data to Redux
    dispatch(setAddressList(response.data.route));
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default getShortestRoute;
