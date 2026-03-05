import {handleApiError} from '@/utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type RouteId = string;

interface UpdateResult {
    success: boolean;
}

export default async function updateAllNewStops(
    routeId: RouteId,
): Promise<UpdateResult> {

    try {
        const response: Response = await fetch(
            `${API_BASE_URL}/api/v1/route/setAllNewStopFalse?route_id=${routeId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response.ok) {
            return {success: true};
        }

        console.warn(
            `API call succeeded but returned non-OK status: ${response.status}`,
        );
        return {success: true};
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
