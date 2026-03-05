import axios from 'axios';
import {handleApiError} from '@/utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;


export default async function getAddressStartIdByAddress(
    address: string,
): Promise<string | ''> {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/api/v1/address/start-address?address=${address}`,
        );

        if (response.status === 200) {
            return response.data;
        }

        return '';
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
