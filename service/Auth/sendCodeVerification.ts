import { handleApiError } from '../../utils/apiErrorHandler'

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
interface VerificationPayload {
  email: string;
  verification_code: string;
}
// ---

const sendCodeVerification = async (
  verificationCode: string, // Explicitly type the verification code
  email: string, // Explicitly type the email string
): Promise<Response | undefined> => {
  // Returns the fetch Response object or undefined on failure

  // 1. Prepare the email: Trim whitespace and remove all internal whitespace
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    // Check if the response was successful (HTTP status 200-299)
    if (response.ok) {
      return response; // Return the whole Response object
    }

  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default sendCodeVerification;
