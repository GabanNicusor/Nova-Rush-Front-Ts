import { Alert } from 'react-native';
import { handleApiError } from '../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
interface ResendCodeResponse {
  status: number;
  ok: boolean;
}
// ---

const sendNewCodeRequest = async (
  email: string, // Explicitly type the input email string
): Promise<ResendCodeResponse | undefined> => {
  // Returns data object or undefined

  try {
    const response: Response = await fetch(
      `${API_BASE_URL}/api/v1/user/verification/resend?email=${email}`,
      {
        method: 'POST',
      },
    );

    // Check if the response was successful (HTTP status 200-299)
    if (response.ok) {
      // Parse and return the JSON data, explicitly casting the type
      return (await response) as ResendCodeResponse;
    } else {
      // Non-2xx status code. Alert the user and return undefined.
      Alert.alert('Your account may be verified already. Please try log in!');

      // Note: If you want to show the specific error from the backend,
      // you might parse response.json() here too before the alert.

      return undefined;
    }
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default sendNewCodeRequest;
