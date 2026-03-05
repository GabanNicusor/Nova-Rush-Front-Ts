import axios, {AxiosResponse} from 'axios';
import {handleApiError} from '@/utils/apiErrorHandler';

const ORS_API_KEY = process.env.EXPO_PUBLIC_ORS_API_KEY;

interface ORSFeatureProperties {
    label: string;
}

interface ORSFeature {
    properties: ORSFeatureProperties;
}

interface ORSGeocodeResponse {
    features: ORSFeature[];
}

export default async function getAddressFromCoordinates(
    latitude: number,
    longitude: number,
): Promise<string> {
    try {
        const response: AxiosResponse<ORSGeocodeResponse> = await axios.get(
            `https://api.openrouteservice.org/geocode/reverse?api_key=${ORS_API_KEY}&point.lon=${longitude}&point.lat=${latitude}`,
        );

        return response.data.features[0]?.properties?.label || 'Unknown Address';
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
