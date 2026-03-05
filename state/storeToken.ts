import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthData {
    token: string;
    username: string;
}

const storeToken = async (value: AuthData): Promise<void> => {
    try {
        await AsyncStorage.setItem('authToken', value.token);
        await AsyncStorage.setItem('username', value.username);
    } catch (e) {

        console.error('Failed to save the token:', e);
    }
};

export default storeToken;
