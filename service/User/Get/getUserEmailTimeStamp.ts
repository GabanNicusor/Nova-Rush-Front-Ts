import axios, { AxiosResponse, AxiosError } from 'axios';
import { handleApiError } from '../../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const getUserEmailTimeStamp = async (email: string): Promise<number | null> => {
    try {
        const response: AxiosResponse<number> = await axios.get(
            `${API_BASE_URL}/api/v1/user/getEmailTimeStamp?email=${email}`,
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );

        if (response.status === 200) {
            return response.data;
        }
    } catch (error: unknown) {
        // Type guard: check if it's an Axios error
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<{ message?: string }>;

            if (axiosError.response?.status === 400 || axiosError.response?.status === 404) {
                // Expected cases: email already verified or not found
                return null;
            }
        }

        // For all other errors (network, 500, unexpected, etc.)
        handleApiError(error);
        throw error;
    }

    return null; // In case status isn't 200 (unlikely with Axios)
};

export default getUserEmailTimeStamp;
