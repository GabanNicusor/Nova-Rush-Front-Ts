import axios, {AxiosResponse} from 'axios';
import {handleApiError} from '@/utils/apiErrorHandler';
import {AddressItemComplete} from "@/types/Address/AddressType";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default async function getUserAddressStart(
    userId: string,
): Promise<AddressItemComplete | undefined> {
    try {
        const response: AxiosResponse<AddressItemComplete> = await axios.get(
            `${API_BASE_URL}/api/v1/user/start-address?user_id=${userId}`,
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
