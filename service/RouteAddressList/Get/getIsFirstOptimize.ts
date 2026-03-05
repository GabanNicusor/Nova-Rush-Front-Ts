import axios, {AxiosResponse} from 'axios';
import {handleApiError} from '@/utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type ListId = string;
type IsOptimized = boolean;

export default async function getIsFirstOptimize(
    list_id: ListId | '' | undefined,
): Promise<IsOptimized> {

    if (!list_id || list_id.includes('function')) {
        console.warn('getIsFirstOptimize blocked invalid ID:', list_id);
        return false;
    }

    try {
        const response: AxiosResponse<IsOptimized> = await axios.get(
            `${API_BASE_URL}/api/v1/route-address-list/getIsOptimize?list_id=${list_id}`,
            {
                headers: {'Content-Type': 'application/json'},
            },
        );

        if (response.status === 200) {
            return response.data;
        }
        return false;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
