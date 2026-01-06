import axios, { AxiosResponse } from 'axios';
import { handleApiError } from '../../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const getAddressStartId = async (
  userId: string, // Assuming user ID used in the query is also a string (UUID)
): Promise<string | ''> => {
  // Type the return promise
  try {
    const response: AxiosResponse<string> = await axios.get(
      `${API_BASE_URL}/api/v1/user/start-address?user_id=${userId}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status === 200) {
      // TypeScript knows response.data is UserStartAddress with id: string
      return response.data;
    }

    // If status is not 200, return undefined explicitly
    return '';
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default getAddressStartId;
