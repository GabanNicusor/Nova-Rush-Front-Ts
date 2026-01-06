import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse } from 'axios';
import { handleApiError } from '../../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
type UserId = string;
type Username = string;

interface UserProfile {
  user_id: UserId;
  username: Username;
  email: string;
  // ...
}
// ---

/**
 * Retrieves the current user's profile information from the backend.
 * Uses 'username' from AsyncStorage as the identifier for the GET request.
 * @returns A promise that resolves to the UserProfile object.
 */
const getUserInfo = async (): Promise<UserProfile> => {
  try {
    // AsyncStorage.getItem returns string | null
    const token: string | null = await AsyncStorage.getItem('username');

    if (!token) {
      // Throw a specific error if the required token is missing
      throw new Error(
        'Authentication token (username) not found in AsyncStorage.',
      );
    }

    // Use Generics: <UserProfile> tells TypeScript the structure of response.data
    const response: AxiosResponse<UserProfile> = await axios.get(
      `${API_BASE_URL}/api/v1/user/get-profile?username=${token}`,
      {
        headers: {
          'Content-Type': `Application/json`,
        },
      },
    );

    // Axios response.data is already the parsed JSON body
    return response.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default getUserInfo;
