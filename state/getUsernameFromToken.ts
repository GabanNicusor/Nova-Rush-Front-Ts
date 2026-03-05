import {jwtDecode} from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface JwtPayload {
    sub?: string;
}

export default async function getUsernameFromToken(): Promise<string | undefined> {
    try {
        const token = await AsyncStorage.getItem('authToken');

        if (!token) {
            console.warn('Authentication token not found in storage.');
            return undefined;
        }

        const decodedToken = jwtDecode<JwtPayload>(token);

        return decodedToken?.sub;
    } catch (error) {
        console.error('Failed to decode token:', error);

        return undefined;
    }
};
