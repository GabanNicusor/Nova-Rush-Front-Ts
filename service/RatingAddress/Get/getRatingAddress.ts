import axios, {AxiosError, AxiosResponse} from 'axios';
import {RatingAddressItemComplete} from '@/types/RatingAddress/RatingAddressType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface ApiErrorResponse {
    _embedded?: {
        errors?: { message: string }[];
    };
    message?: string;
}

export default async function getRatingAddress(
    addressId: string,
): Promise<RatingAddressItemComplete | undefined> {

    try {
        const response: AxiosResponse<RatingAddressItemComplete> = await axios.get(
            `${API_BASE_URL}/api/v1/rating/address/getRatingAddress?address_id=${addressId}`,
            {
                headers: {'Content-Type': 'application/json'},
            },
        );

        if (response.status === 200) {
            return response.data;
        }

    } catch (error) {
        const axiosError = error as AxiosError;

        const errorData = axiosError.response?.data as ApiErrorResponse | undefined;

        const errorMsg: string | undefined =
            errorData?._embedded?.errors?.[0]?.message;

        if (errorMsg === undefined || errorMsg === null || errorMsg === '' || errorMsg === 'Page Not Found') {
            return undefined;
        }

    }
};
