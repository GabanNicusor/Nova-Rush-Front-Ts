import { ORSSuggestionItem } from '../../../types/OpenRouteService/ORSSuggestionType';
import { AddressItem } from '../../../types/Address/AddressType';


const ORS_API_KEY = process.env.EXPO_PUBLIC_ORS_API_KEY;

// --- Type Definitions (Imported or Defined Here) ---
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
  // ... other response keys like 'geocoding'
}


const fetchSuggestionsFromORS = async (
  query: string, // Explicitly type the input query
): Promise<AddressItem[]> => {
  // Explicitly type the return promise

  // Early exit with a clear return type
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    const response = await fetch(
      `https://api.openrouteservice.org/geocode/autocomplete?api_key=${ORS_API_KEY}&text=${encodeURIComponent(
        query,
      )}`,
    );

    // Check for non-2xx status codes
    if (!response.ok) {
      // Read and log the error, then throw
      const errorText = await response.text();
      console.error(`ORS API Error (Status ${response.status}):`, errorText);
      throw new Error(`ORS API failed with status ${response.status}`);
    }

    // Cast the parsed JSON data to the expected ORSResponse structure
    const data: ORSResponse = await response.json();

    // Ensure features exists and is an array before mapping
    if (!data.features || !Array.isArray(data.features)) {
      return [];
    }

    const suggestions: ORSSuggestionItem[] = data.features.map(feature => ({
      id: feature.properties.id,
      address: feature.properties.label,
      coordinates: feature.geometry.coordinates,
    }));

    // 3. Normalize and convert the ORSSuggestion[] array to the UnifiedAddressSuggestion[] array
    return suggestions.map(s => ({
      id: s.id.toString(),
      address_complete: s.address,
      latitude: s.coordinates[1],
      longitude: s.coordinates[0],
    })) as AddressItem[];

  } catch (error) {
    // Log the error for debugging purposes
    console.error('Error fetching ORS suggestions:', error);

    // In this type of utility function, it's often best to return an empty array
    // on failure rather than throwing, but if you need error handling elsewhere,
    // you might re-throw the error. We choose a safe return here.
    // If you were using handleApiError from previous examples, you'd throw here.
    // For simplicity in this standalone file, we return empty array.
    return [];
  }
};

export default fetchSuggestionsFromORS;
