import axios, { AxiosResponse } from 'axios';
import { AddressDetailsItemComplete } from '../../../types/AddressDetails/AddressDetailsType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const getAddressDetails = async (
  userId: string, // Explicitly type the input
  addressId: string, // Explicitly type the input
): Promise<AddressDetailsItemComplete | undefined> => {
  // Type the return promise to be AddressDetail OR null

  try {
    // Use Generics: <AddressDetail> tells TypeScript the structure of response.data
    const response: AxiosResponse<AddressDetailsItemComplete> = await axios.get(
      `${API_BASE_URL}/api/v1/address-details/getAddressDetails?user_id=${userId}&address_id=${addressId}`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.status === 200) {
      // TypeScript knows response.data is AddressDetail
      return response.data;
    }

  } catch (error) {

    // Return null as defined in the original catch block
    return undefined;
  }
};

export default getAddressDetails;
