import axios, { AxiosResponse } from 'axios';
import { handleApiError } from '../../../utils/apiErrorHandler';
import { AddressItemComplete } from '../../../types/Address/AddressType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type AddressSuggestionsResponse = AddressItemComplete[];
// ---

const fetchAddressSuggestions = async (
  address: string, // Explicitly type the input string
): Promise<AddressSuggestionsResponse | undefined> => {
  // Type the return promise

  try {
    const url = `${API_BASE_URL}/api/v1/address/find-address-suggestion?letters=${encodeURIComponent(
      address,
    )}`;

    // Use Generics: <AddressSuggestionsResponse> tells TypeScript the structure of response.data
    const response: AxiosResponse<AddressSuggestionsResponse> = await axios.get(
      url,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status === 200) {
      // TypeScript knows response.data is AddressSuggestionsResponse
      return response.data;
    }

  } catch (error) {
    // Assuming handleApiError handles the user notification and re-throws the error
    handleApiError(error);
    throw error;
  }
};

export default fetchAddressSuggestions;
