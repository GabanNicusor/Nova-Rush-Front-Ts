import {handleApiError} from '@/utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type ListId = string;
type AddressId = string;

export default async function deleteAddressFromRouteStop(
    list_id: ListId,
    address_id: AddressId,
): Promise<boolean | undefined> {

    try {
        const response: Response = await fetch(
            `${API_BASE_URL}/api/v1/route/deleteAddressFromStopOrder?list_id=${list_id}&address_id=${address_id}`,
            {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
            },
        );

        if (response.status === 200) {
            return response.ok;
        }
        
        return undefined;
    } catch (error) {
        console.error('deleteAddressFromRouteStop error:', error);
        handleApiError(error);
        throw error;
    }
};
