import {handleApiError} from '@/utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface RegistrationPayload {
    username: string;
    email: string;
    password: string;
    policies: string[];
    token: string;
}

export interface RegistrationSuccessResponse {
    success: boolean;
    message: string;
    user_id: string;
}

export interface RegistrationErrorResponse {
    success: boolean;
    message: string;
}

export type RegistrationResponse =
    | RegistrationSuccessResponse
    | RegistrationErrorResponse;

export default async function sendUserCredentialsToRegister(
    username: string,
    email: string,
    password: string,
): Promise<RegistrationResponse> {

    const cleanUsername = username.toLowerCase().trim().replace(/\s+/g, '');
    const cleanEmail = email.trim().replace(/\s+/g, '');
    const cleanPassword = password.trim().replace(/\s+/g, '');

    const payload: RegistrationPayload = {
        username: cleanUsername,
        email: cleanEmail,
        password: cleanPassword,
        policies: ['default'],
        // NOTE: The 'token' value looks like a hardcoded security measure.
        // Ensure this is intentional and correctly handled by your backend.
        token: 'hvs.Q8QhkxxaAObSgvQSfOb27cag',
    };

    try {
        const response: Response = await fetch(
            `${API_BASE_URL}/api/v1/user/register`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(payload),
            },
        );

        return await response.json();
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
