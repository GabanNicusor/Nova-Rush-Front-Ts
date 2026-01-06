import axios, { AxiosResponse } from 'axios';
import { handleApiError } from '../../../utils/apiErrorHandler';

const ORS_API_KEY = process.env.EXPO_PUBLIC_ORS_API_KEY;

// --- Type Definitions (Imported or Defined Here) ---
interface ORSFeatureProperties {
  label: string;
}

interface ORSFeature {
  properties: ORSFeatureProperties;
}

interface ORSGeocodeResponse {
  features: ORSFeature[];
}
// ---

const getAddressFromCoordinates = async (
  latitude: number, // Explicitly type the input latitude
  longitude: number, // Explicitly type the input longitude
): Promise<string> => {
  // The function returns a promise resolving to a string
  try {
    // Use Generics: <ORSGeocodeResponse> tells TypeScript the structure of response.data
    const response: AxiosResponse<ORSGeocodeResponse> = await axios.get(
      `https://api.openrouteservice.org/geocode/reverse?api_key=${ORS_API_KEY}&point.lon=${longitude}&point.lat=${latitude}`,
    );

    // Use optional chaining (?.) for safe, type-checked access to nested properties.
    // If features[0], properties, or label is missing, it returns undefined,
    // which falls back to "Unknown Address".
    return response.data.features[0]?.properties?.label || 'Unknown Address';
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default getAddressFromCoordinates;
