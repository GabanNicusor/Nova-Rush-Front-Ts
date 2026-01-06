import getUserInfo from './getUserInfo';
import { handleApiError } from '../../../utils/apiErrorHandler';

// --- Type Definitions (Imported or Defined Here) ---
type UserId = string;

interface UserInfo {
  user_id: UserId;
}
// ---

/**
 * Fetches the current user's information and returns only the user ID.
 * @returns A promise that resolves to the user's ID (string).
 */
const getUserId = async (): Promise<UserId> => {
  try {
    // Assume getUserInfo returns the structured UserInfo object
    const userInfo: UserInfo = await getUserInfo();

    // Safely extract the user_id property
    return userInfo.user_id;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default getUserId;
