import { AppDispatch } from '../../../state/store';
import { setRouteList, setAddressListId} from '../../../state/navSlice';
import { handleApiError } from '../../../utils/apiErrorHandler';

// Service
import getUserId from '../../User/Get/getUserId';
import fetchUserAddressList from '../../User/Fetch/fetchUserAddressList';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
interface NewListPayload {
  user_id: string;
  list_name: string;
  createdAt: string;
}

interface CreateListResponse {
  success: boolean;
  message: string;
}

interface RouteListItem {
  id: string;
  list_name: string;
}
// ---

const createNewRouteList = async (
  listName: string, // Explicitly type the list name string
  chosenDate: string, // Explicitly type the date string
  dispatch: AppDispatch, // Explicitly type the Redux dispatch function
): Promise<CreateListResponse> => {
  // Returns a promise resolving to the API response object

  // Get user ID
  const user_id: string = await getUserId();

  // 1. Construct the payload object with type safety
  const payload: NewListPayload = {
    user_id: user_id,
    list_name: listName,
    createdAt: chosenDate,
  };

  try {
    // 2. POST the new list details
    const response: Response = await fetch(
      `${API_BASE_URL}/api/v1/route-address-list/createNewAddressList`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      // Throw an error if the server responded with a non-2xx status
      const errorBody = await response.text();
      throw new Error(
        `Failed to create list: ${response.status} - ${errorBody}`,
      );
    }

    // 3. Fetch updated route list after creation
    const routeList: RouteListItem[] = await fetchUserAddressList();
    // 4. Dispatch the updated route list to Redux
    dispatch(setRouteList(routeList));
    // 5. Return the parsed response from the creation endpoint
    console.log("Create New List",await response.data);
    return  await response.json();

  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default createNewRouteList;
