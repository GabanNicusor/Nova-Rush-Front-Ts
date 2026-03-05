import axios, {AxiosResponse} from 'axios';
import {handleApiError} from '@/utils/apiErrorHandler';
import {AddressItemComplete} from '@/types/Address/AddressType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type AddressSuggestionsResponse = AddressItemComplete[];

export default async function fetchAddressSuggestions(
    address: string,
): Promise<AddressSuggestionsResponse | undefined> {

    try {
        const url = `${API_BASE_URL}/api/v1/address/find-address-suggestion?letters=${encodeURIComponent(
            address,
        )}`;

        const response: AxiosResponse<AddressSuggestionsResponse> = await axios.get(
            url,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response.status === 200) {
            return response.data;
        }

    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
