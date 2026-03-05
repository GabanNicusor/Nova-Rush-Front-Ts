import axios, {AxiosError, AxiosResponse} from 'axios';
import {StopDetailsType} from '@/types/StopDetails/StopDetailsType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type UserId = string;
type AddressId = string;

interface ApiErrorResponse {
    _embedded?: {
        errors?: { message: string }[];
    };
    message?: string;
}

export default async function GetStopDetails(
    addressId: AddressId,
    addressListId: string | null,
    userId: UserId,
): Promise<StopDetailsType | undefined> {

    try {

        const response: AxiosResponse<StopDetailsType> = await axios.get(
            `${API_BASE_URL}/api/v1/stop-details/getStopDetails`,
            {
                headers: {'Content-Type': 'application/json'},
                params: {
                    address_id: addressId,
                    address_list_id: addressListId,
                    user_id: userId,
                },
            },
        );

        if (response.status === 200) {
            return response.data;
        }
        return undefined;
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
