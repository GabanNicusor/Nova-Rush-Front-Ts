import {handleApiError} from '@/utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface AddressDetailsPayload {
    user_id: string;
    address_id: string;
    name: string;
    number: string;
    notes: string;
}

export default async function createOrUpdateAddressDetails(
    userId: string,
    addressId: string,
    name: string,
    number: string,
    notes: string,
): Promise<void> {
    const payload: AddressDetailsPayload = {
        user_id: userId,
        address_id: addressId,
        name: name,
        number: number,
        notes: notes,
    };

    try {
        await fetch(
            `${API_BASE_URL}/api/v1/address-details/createOrUpdateAddressDetails`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            },
        );

    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
