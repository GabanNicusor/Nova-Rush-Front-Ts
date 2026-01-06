import { ToastAndroid, Platform, Alert } from 'react-native';
import axios from 'axios'; // Use built-in Axios types

// Define the shape of YOUR backend's error body
interface BackendErrorBody {
  message?: string;
  _embedded?: {
    errors?: Array<{ message: string }>;
  };
}

const showError = (message: string): void => {
  const finalMessage =
    message.trim() || 'Something went wrong. Please try again.';

  if (Platform.OS === 'android') {
    ToastAndroid.show(finalMessage, ToastAndroid.LONG);
  } else {
    Alert.alert('Error', finalMessage);
  }
};

export const handleApiError = (error: unknown): void => {
  let userMessage = 'Something went wrong. Please try again.';

  // Use axios.isAxiosError for the best type safety
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as BackendErrorBody;

    // 1. Check your specific backend path
    const specificMessage = data?._embedded?.errors?.[0]?.message;

    if (specificMessage) {
      userMessage = specificMessage;
    }
    // 2. Check general message
    else if (data?.message) {
      userMessage = data.message;
    }
    // 3. Fallback to Status Codes
    else if (error.response?.status === 401) {
      userMessage = 'Session expired. Please log in again.';
    }
  } else if (error instanceof Error) {
    // Handle non-axios errors (like syntax errors or manual throws)
    userMessage = error.message;
  }

  showError(userMessage);

  // Re-throw so the calling function knows the request failed
  throw error;
};
