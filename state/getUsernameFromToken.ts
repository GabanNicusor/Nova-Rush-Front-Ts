import {jwtDecode} from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the interface for the minimal expected JWT payload
interface JwtPayload {
  sub?: string; // The subject (typically the user ID or username)
}

// Define the return type: The function returns a Promise that resolves to a string (the username)
// or undefined if the token is missing or decoding fails.
const getUsernameFromToken = async (): Promise<string | undefined> => {
  try {
    // 1. Get the token from storage
    const token = await AsyncStorage.getItem('authToken');

    // Check if token exists before trying to decode
    if (!token) {
      console.warn('Authentication token not found in storage.');
      return undefined;
    }

    // 2. Decode the token and cast the result to our defined interface
    // The jwtDecode function is a third-party library, so we cast the return type.
    const decodedToken = jwtDecode<JwtPayload>(token);

    // 3. Return the subject claim
    // Optional chaining (?.) is used for safe access in case 'sub' is missing.
    return decodedToken?.sub;
  } catch (error) {
    // Log the error and ensure it's handled safely
    console.error('Failed to decode token:', error);

    // Return undefined on error as a successful flow
    return undefined;
  }
};

// Export the function itself
export default getUsernameFromToken;
