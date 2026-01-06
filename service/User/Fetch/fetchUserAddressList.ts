import getUserId from '../Get/getUserId';
import getUserAddressList from '../../RouteAddressList/Get/getUserAddressList';
import { handleApiError } from '../../../utils/apiErrorHandler';

// --- Type Definitions (Imported or Defined Here) ---
type UserId = string;

interface UserAddressListItem {
  id: string;
  createdAt: string;
  list_name: string;
  user_id: string;
}
// ---

/**
 * Fetches all route/address lists for the current logged-in user.
 * @returns A promise that resolves to an array of UserAddressListItem objects.
 */
const fetchUserAddressList = async (): Promise<UserAddressListItem[]> => {
  try {
    // We assume getUserId returns string or null, and the service handles the null case.
    const user_id: UserId | null = await getUserId();

    if (!user_id) {
      console.warn('User ID not found. Returning empty list.');
      return []; // Return an empty array if the user is not identified
    }

    // Response is expected to be an array of UserAddressListItem objects


    return await getUserAddressList(user_id);
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default fetchUserAddressList;
