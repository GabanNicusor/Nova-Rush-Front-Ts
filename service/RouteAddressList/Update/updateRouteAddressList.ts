import {handleApiError} from '@/utils/apiErrorHandler';
import {StopOrderItem} from '@/types/StopOrder/StopOrder';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface UpdateRoutePayload {
    stop_order: StopOrderItem[];
    route_id: string;
}

export default async function updateRouteAddressList(
    addresses: StopOrderItem[],
    routeId: string,
): Promise<boolean | undefined> {

    const payload: UpdateRoutePayload = {
        stop_order: addresses,
        route_id: routeId,
    };

    try {
        const response: Response = await fetch(
            `${API_BASE_URL}/api/v1/route-address-list/updateRouteListAddresses`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            },
        );

        if (response.status === 200) {
            return response.ok;
        }

        console.warn(`Failed to update route list. Status: ${response.status}`);
        return undefined;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
