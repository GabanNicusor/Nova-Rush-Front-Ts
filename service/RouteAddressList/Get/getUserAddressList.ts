import {handleApiError} from '@/utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type UserId = string;

interface RouteListItem {
    id: string;
    list_name: string;
    createdAt: string;
    user_id: string;
}

export default async function getUserAddressList(
    userid: UserId,
): Promise<RouteListItem[]> {

    try {
        const response: Response = await fetch(
            `${API_BASE_URL}/api/v1/route-address-list/getAllAddressList?user_id=${userid}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        const text: string = await response.text();

        if (response.ok) {
            return JSON.parse(text);
        }

        console.error(
            `Failed to fetch address lists. Status: ${response.status}. Body: ${text}`,
        );
        return [];
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
