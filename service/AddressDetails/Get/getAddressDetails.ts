import axios, {AxiosResponse} from 'axios';
import {AddressDetailsItemComplete} from '@/types/AddressDetails/AddressDetailsType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default async function getAddressDetails(
    userId: string,
    addressId: string,
): Promise<AddressDetailsItemComplete | undefined> {

    try {
        const response: AxiosResponse<AddressDetailsItemComplete> = await axios.get(
            `${API_BASE_URL}/api/v1/address-details/getAddressDetails?user_id=${userId}&address_id=${addressId}`,
            {
                headers: {'Content-Type': 'application/json'},
            },
        );

        if (response.status === 200) {
            return response.data;
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return undefined;
    }
};
