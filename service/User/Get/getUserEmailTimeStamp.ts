import axios, {AxiosError, AxiosResponse, isAxiosError} from 'axios';
import {handleApiError} from '@/utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export default async function getUserEmailTimeStamp(email: string): Promise<number | null> {
    try {
        const response: AxiosResponse<number> = await axios.get(
            `${API_BASE_URL}/api/v1/user/getEmailTimeStamp?email=${email}`,
            {
                headers: {'Content-Type': 'application/json'},
            }
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message?: string }>;

            if (axiosError.response?.status === 400 || axiosError.response?.status === 404) {
                return null;
            }
        }

        handleApiError(error);
        throw error;
    }

    return null;
};
