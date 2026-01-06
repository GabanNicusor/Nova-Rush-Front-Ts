import axios from 'axios';
import { handleApiError } from '../../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;


const getAddressStartIdByAddress = async (
  address: string, // Explicitly type the input address string
): Promise<string | ''> => {
  // Type the return promise

  try {
    // Use Generics: <AddressData> tells TypeScript the structure of response.data
    const response = await axios.get(
      `${API_BASE_URL}/api/v1/address/start-address?address=${address}`,
    );

    if (response.status === 200) {
      // TypeScript knows response.data is AddressData
      return response.data;
    }

    return '';
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default getAddressStartIdByAddress;
