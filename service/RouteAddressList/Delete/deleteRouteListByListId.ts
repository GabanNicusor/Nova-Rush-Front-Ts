import {handleApiError} from '@/utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type ListId = string;
type UserId = string;
type SuccessResponseText = string;

export default async function deleteRouteListByListId(
    list_id: ListId,
    user_id: UserId,
): Promise<SuccessResponseText | undefined> {

    try {
        const response: Response = await fetch(
            `${API_BASE_URL}/api/v1/route-address-list/deleteList?list_id=${list_id}&user_id=${user_id}`,
            {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
            },
        );

        const responseText: string = await response.text();

        if (response.ok) {
            return responseText;
        }

        console.error(
            `Failed to delete list (Status: ${response.status}): ${responseText}`,
        );
        return undefined;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
