import getUserId from '../Get/getUserId';
import getUserAddressList from '../../RouteAddressList/Get/getUserAddressList';
import { handleApiError } from '../../../utils/apiErrorHandler';

// --- Type Definitions (Imported or Defined Here) ---
type UserId = string;
type ListId = string;

interface UserAddressListItem {
  id: ListId;
  list_name: string;
}

// Internal type for the mapped response
interface MappedListItem {
  id: ListId;
  label: string;
}
// ---

/**
 * Fetches the user's route/address lists and returns the ID of the first list found.
 * @returns The ID (string) of the first list, or null if no lists are found.
 */
const fetchFirstListId = async (): Promise<ListId | ''> => {
  try {
    const user_id: UserId | null = await getUserId();

    if (!user_id) {
      console.error('No user_id available, skipping fetchAddresses.');
      // Returning null/string instead of [] to match the final return type logic
      return '';
    }

    // Response is expected to be an array of UserAddressListItem objects
    const response: UserAddressListItem[] | unknown = await getUserAddressList(
      user_id,
    );

    if (Array.isArray(response)) {
      // Mapping the response is actually unnecessary for just getting the first ID,
      // but we preserve the mapping logic for comparison/debugging.
      const mappedResponse: MappedListItem[] = response.map(
        (item: UserAddressListItem) => ({
          id: item.id,
          label: item.list_name,
        }),
      );

      // Select the list_id of the first item
      const firstListId: ListId | null =
        mappedResponse.length > 0 ? mappedResponse[0].id : null;

      if (firstListId) {
        return firstListId;
      } else {
        console.error('No Route found.');
        return '';
      }
    }

    // Handle cases where getUserAddressList returns a non-array but doesn't throw
    console.warn('getUserAddressList did not return an array.');
    return '';
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default fetchFirstListId;
