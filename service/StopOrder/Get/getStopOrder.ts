import axios, {AxiosError, AxiosResponse} from 'axios';
import {RoutePathItem} from '@/types/RoutePath/RoutePathType';
import {StopOrderItem} from '@/types/StopOrder/StopOrder';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface ApiErrorResponse {
    _embedded?: {
        errors?: { message: string }[];
    };
}

export default async function getStopOrder(
    listId: string | null,
): Promise<StopOrderItem[] | undefined> {

    try {
        const response: AxiosResponse<RoutePathItem> = await axios.get(
            `${API_BASE_URL}/api/v1/route/getStopOrder?route_id=${listId}`,
            {headers: {'Content-Type': 'application/json'}},
        );

        if (response.status === 200) {
            return response.data.stop_order;
        }

    } catch (error) {
        const axiosError = error as AxiosError;

        const errorData = axiosError.response?.data as ApiErrorResponse | undefined;

        const errorMsg: string | undefined =
            errorData?._embedded?.errors?.[0]?.message;
        if (errorMsg === undefined || errorMsg === null || errorMsg === '' || errorMsg === 'Page Not Found') {
            return [];
        }
    }
};
