import {ORSSuggestionItem} from '@/types/OpenRouteService/ORSSuggestionType';
import {AddressItem} from '@/types/Address/AddressType';


const ORS_API_KEY = process.env.EXPO_PUBLIC_ORS_API_KEY;

type Coordinates = [number, number];

interface ORSFeatureProperties {
    id: number;
    label: string;
}

interface ORSFeatureGeometry {
    coordinates: Coordinates;
}

interface ORSFeature {
    properties: ORSFeatureProperties;
    geometry: ORSFeatureGeometry;
}

interface ORSResponse {
    features: ORSFeature[];
}


export default async function  fetchSuggestionsFromORS (
    query: string,
): Promise<AddressItem[]> {

    if (!query || query.trim().length === 0) {
        return [];
    }

    try {
        const response = await fetch(
            `https://api.openrouteservice.org/geocode/autocomplete?api_key=${ORS_API_KEY}&text=${encodeURIComponent(
                query,
            )}`,
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`ORS API Error (Status ${response.status}):`, errorText);
        }

        const data: ORSResponse = await response.json();

        if (!data.features || !Array.isArray(data.features)) {
            return [];
        }

        const suggestions: ORSSuggestionItem[] = data.features.map(feature => ({
            id: feature.properties.id,
            address: feature.properties.label,
            coordinates: feature.geometry.coordinates,
        }));

        return suggestions.map(s => ({
            id: s.id.toString(),
            address_complete: s.address,
            latitude: s.coordinates[1],
            longitude: s.coordinates[0],
        })) as AddressItem[];

    } catch (error) {
        console.error('Error fetching ORS suggestions:', error);
        return [];
    }
};
