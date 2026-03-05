import {fetch} from 'expo/fetch';
import {handleApiError} from '@/utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type ListId = string;

export default async function deleteAllStopDetails(
    listId: ListId,
): Promise<boolean | undefined> {

    try {
        const response: Response = await fetch(
            `${API_BASE_URL}/api/v1/stop-details/deleteAllStopDetails?list_id=${listId}`,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        if (response.status === 200) {
            return response.ok;
        }

        console.warn(
            `Failed to delete stop details for list ${listId}. Status: ${response.status}`,
        );
        return undefined;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
