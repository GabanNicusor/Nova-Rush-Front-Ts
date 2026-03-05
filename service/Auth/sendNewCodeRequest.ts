import {Alert} from 'react-native';
import {handleApiError} from '@/utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface ResendCodeResponse {
    status: number;
    ok: boolean;
}

export default async function sendNewCodeRequest(
    email: string,
): Promise<ResendCodeResponse | undefined> {

    try {
        const response: Response = await fetch(
            `${API_BASE_URL}/api/v1/user/verification/resend?email=${email}`,
            {
                method: 'POST',
            },
        );

        if (response.ok) {
            return response as ResendCodeResponse;
        } else {
            Alert.alert('Your account may be verified already. Please try log in!');
            return undefined;
        }
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
