import {handleApiError} from '@/utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface SetStartAddressPayload {
    user_id: string;
    address_id: string;
}

type SetStartAddressResponse = string | void;

export default async function addUserStartAddress(
    userId: string,
    addressId: string
): Promise<SetStartAddressResponse> {

    const payload: SetStartAddressPayload = {
        user_id: userId,
        address_id: addressId,
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/address/starting-address`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            return await response.text();
        }

    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
