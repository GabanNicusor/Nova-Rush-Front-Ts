import StoreToken from '../../state/storeToken';
import { handleApiError } from '../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
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
// ---

const sendUserCredentialsToAuthenticate = async (
  emailOrUsername: string, // Explicitly type the input
  password: string, // Explicitly type the input
): Promise<AuthResponse> => {
  // Returns a promise resolving to the AuthResponse union type

  // 1. Prepare clean credentials
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

    // 2. Parse the response as JSON (can be success or error payload)
    const data: AuthResponse = await response.json();

    // 3. Check for the token property to determine success (Type Predicate recommended here)
    // If data is AuthSuccessResponse (which has 'token'), store it.
    if (data && 'token' in data) {
      await StoreToken(data as AuthSuccessResponse);
    }

    // Return the parsed data (which could be the token or an error message)
    return data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default sendUserCredentialsToAuthenticate;
