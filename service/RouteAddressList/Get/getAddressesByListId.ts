import axios, {AxiosError, AxiosResponse} from 'axios';
import {handleApiError} from '@/utils/apiErrorHandler';
import {AddressItemComplete} from '@/types/Address/AddressType';
import getUserId from '../../../service/User/Get/getUserId'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface ApiErrorResponse {
    _embedded?: {
        errors?: { message: string }[];
    };
}

export default async function getAddressesByListId(
    addressListId: string | null,
): Promise<AddressItemComplete[]> {
    try {
        const userId = await getUserId()
        const response: AxiosResponse<AddressItemComplete[]> = await axios.get(
            `${API_BASE_URL}/api/v1/address/address-lists/addresses?addresses_list_id=${addressListId}&user_id=${userId}`,
            {
                headers: {'Content-Type': 'application/json'},
            },
        );

        if (response.status === 200) {
            return response.data;
        }

        return [];
    } catch (error) {
        const axiosError = error as AxiosError;

        const errorData = axiosError.response?.data as ApiErrorResponse | undefined;

        const errorMsg = errorData?._embedded?.errors?.[0]?.message;

        if (errorMsg === 'Route not found.') {
            return [];
        } else {
            handleApiError(error);
            throw error;
        }
    }
};
