import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosResponse} from 'axios';
import {handleApiError} from '@/utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type UserId = string;
type Username = string;

interface UserProfile {
    user_id: UserId;
    username: Username;
    email: string;
}

export default async function getUserInfo(): Promise<UserProfile> {
    try {
        const token: string | null = await AsyncStorage.getItem('username');

        const response: AxiosResponse<UserProfile> = await axios.get(
            `${API_BASE_URL}/api/v1/user/get-profile?username=${token}`,
            {
                headers: {
                    'Content-Type': `Application/json`,
                },
            },
        );

        return response.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
