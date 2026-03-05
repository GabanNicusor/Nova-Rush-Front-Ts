import {handleApiError} from '@/utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type RouteId = string;
type AddressId = string;

interface UpdateResult {
    success: boolean;
}

export default async function updateNewStop(
    routeId: RouteId,
    addressId: AddressId,
): Promise<UpdateResult | undefined> {

    try {
        const response: Response = await fetch(
            `${API_BASE_URL}/api/v1/route/setNewStopFalse?route_id=${routeId}&address_id=${addressId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response.ok || response.status === 204 || response.status === 200) {
            return {success: true};
        }

    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
