import {handleApiError} from '@/utils/apiErrorHandler';
import {AddressItemComplete} from '@/types/Address/AddressType';


const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface AddAddressPayload {
    address_complete: string;
    latitude: number;
    longitude: number;
}

interface AddAddressResponse {
    success: boolean;
    message: string;
    data?: AddressItemComplete;
}


export default async function addNewAddress(
    address_complete: string,
    latitude: number,
    longitude: number,
): Promise<AddAddressResponse> {

    const payload: AddAddressPayload = {
        address_complete: address_complete,
        latitude,
        longitude,
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/address/add-address`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        return (await response.json()) as AddAddressResponse;
    } catch (error) {

        handleApiError(error);
        throw error;
    }
};
