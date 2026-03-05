import StoreToken from '../../state/storeToken';
import {handleApiError} from '@/utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export interface AuthSuccessResponse {
    token: string;
    user_id: string;
    username: string;
}

export interface AuthErrorResponse {
    success: false;
    message: string;
}

export type AuthResponse = AuthSuccessResponse | AuthErrorResponse;

export default async function sendUserCredentialsToAuthenticate(
    emailOrUsername: string,
    password: string,
): Promise<AuthResponse> {

    const cleanUsername = emailOrUsername
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '');
    const cleanPassword = password.trim().replace(/\s+/g, '');

    try {
        const response: Response = await fetch(
            `${API_BASE_URL}/api/v1/user/authenticate`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    username: cleanUsername,
                    password: cleanPassword,
                }),
            },
        );

        const data: AuthResponse = await response.json();

        if (data && 'token' in data) {
            await StoreToken(data as AuthSuccessResponse);
        }

        return data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
