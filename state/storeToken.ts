import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the interface for the input object (the user data)
interface AuthData {
  token: string;
  username: string;
}

// Explicitly type the input argument and the function's return type
const storeToken = async (value: AuthData): Promise<void> => {
  try {
    // Use the properties from the typed object
    await AsyncStorage.setItem('authToken', value.token);
    await AsyncStorage.setItem('username', value.username);
  } catch (e) {
    // Since 'e' from a catch block is often 'unknown' in strict TS,
    // we can safely log it.
    console.error('Failed to save the token:', e);
  }
};

export default storeToken;
