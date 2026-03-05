import {handleApiError} from '@/utils/apiErrorHandler'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface VerificationPayload {
    email: string;
    verification_code: string;
}

export default async function sendCodeVerification(
    verificationCode: string,
    email: string,
): Promise<Response | undefined> {

    const cleanEmail = email.trim().replace(/\s+/g, '');

    // 2. Construct the payload object with type safety
    const payload: VerificationPayload = {
        email: cleanEmail,
        verification_code: verificationCode,
    };

    try {
        const response: Response = await fetch(
            `${API_BASE_URL}/api/v1/user/verification`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            },
        );

        if (response.ok) {
            return response;
        }

    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
