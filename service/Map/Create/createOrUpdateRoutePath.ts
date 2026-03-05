import {handleApiError} from '@/utils/apiErrorHandler';
import {StopOrderItem} from '@/types/StopOrder/StopOrder';
import {RoutePathItem} from '@/types/RoutePath/RoutePathType'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface RoutePathPayload {
    polyline: string;
    stop_order: StopOrderItem[];
    user_id: string;
    route_id: string;
}


export async function  createOrUpdateRoutePath (
    polyline: string,
    stopOrder: StopOrderItem[],
    userId: string,
    addressListId: string,
): Promise<RoutePathItem | void>  {

    const payload: RoutePathPayload = {
        polyline: polyline,
        stop_order: stopOrder,
        user_id: userId,
        route_id: addressListId,
    };

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/v1/route-path/saveRoutePath`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            },
        );

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(
                `API request failed with status ${response.status}: ${errorBody}`,
            );
        }

    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

