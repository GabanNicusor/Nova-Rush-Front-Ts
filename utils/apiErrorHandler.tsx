import {Alert, Platform, ToastAndroid} from 'react-native';
import {isAxiosError} from 'axios';

interface BackendErrorBody {
    message?: string;
    _embedded?: {
        errors?: { message: string }[];
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

export function handleApiError(error: unknown): void {
    let userMessage = 'Something went wrong. Please try again.';

    if (isAxiosError(error)) {
        const data = error.response?.data as BackendErrorBody;

        const specificMessage = data?._embedded?.errors?.[0]?.message;

        if (specificMessage) {
            userMessage = specificMessage;
        } else if (data?.message) {
            userMessage = data.message;
        } else if (error.response?.status === 401) {
            userMessage = 'Session expired. Please log in again.';
        }
    } else if (error instanceof Error) {
        userMessage = error.message;
    }

    showError(userMessage);
    throw error;
}
