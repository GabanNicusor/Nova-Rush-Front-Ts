import {handleApiError} from '@/utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface AddressPayload {
    address_list_id: string;
    address_complete: string;
    latitude: number;
    longitude: number;
}

export default async function addAddressToList(
    addressComplete: string,
    latitude: number,
    longitude: number,
    addressListId: string | '',
): Promise<string | undefined> {

    const payload: AddressPayload = {
        address_list_id: addressListId,
        address_complete: addressComplete,
        latitude: latitude,
        longitude: longitude,
    };

    try {
        const response: Response = await fetch(
            `${API_BASE_URL}/api/v1/address/address-lists/addresses`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            },
        );

        if (response.ok) {
            return await response.text();
        }

        console.warn(`Failed to add address, status: ${response.status}`);
        return undefined;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
