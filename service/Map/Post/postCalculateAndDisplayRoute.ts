import {AppDispatch} from '@/state/store';
import {setDirectionSteps, setPolylineCoordsList,} from '@/state/navSlice';
import {handleApiError} from '@/utils/apiErrorHandler';

import {fetchOSRMDirections} from '../../Direction/fetchOSRMDirection';
import {AddressItemComplete} from '@/types/Address/AddressType';
import {ORSMDirectionsType, RouteStep,} from '@/types/OpenRouteService/ORSManeuversType';


interface LatLng {
    latitude: number;
    longitude: number;
}

type LngLatArray = [number, number];

const chunkWaypoints = (
    waypoints: LngLatArray[],
    chunkSize: number,
): LngLatArray[][] => {
    const chunks: LngLatArray[][] = [];
    for (let i = 0; i < waypoints.length; i += chunkSize - 1) {
        chunks.push(waypoints.slice(i, i + chunkSize));
    }
    return chunks;
};

const removeDiscontinuities = (coords: LatLng[]): LatLng[] => {
    let cleanedCoords: LatLng[] = coords.length > 0 ? [coords[0]] : [];

    for (let i = 1; i < coords.length; i++) {
        const prev = cleanedCoords[cleanedCoords.length - 1];
        const curr = coords[i];

        if (prev.latitude !== curr.latitude || prev.longitude !== curr.longitude) {
            cleanedCoords.push(curr);
        }
    }
    return cleanedCoords;
};

export default async function postCalculateAndDisplayRoute(
    address: AddressItemComplete[],
    dispatch: AppDispatch,
): Promise<void> {

    if (address.length < 2) {
        return;
    }
    const origin: LngLatArray = [address[0].longitude, address[0].latitude];
    const destination: LngLatArray = [
        address[address.length - 1].longitude,
        address[address.length - 1].latitude,
    ];

    const waypoints: LngLatArray[] = address
        .slice(1, -1)
        .map(({latitude, longitude}) => [longitude, latitude]);

    const waypointChunks: LngLatArray[][] = chunkWaypoints(waypoints, 48);

    let allCoords: LatLng[] = [];
    let currentOrigin: LngLatArray = origin;
    let allSteps: RouteStep[] = [];

    try {
        for (let i = 0; i < waypointChunks.length; i++) {
            const chunk = waypointChunks[i];
            const isLastChunk = i === waypointChunks.length - 1;

            const chunkDestination: LngLatArray = isLastChunk
                ? destination
                : chunk[chunk.length - 1];

            const coordinatesToFetch: LngLatArray[] = [currentOrigin, ...chunk];

            if (isLastChunk || chunk.length < 48 - 1) {
                coordinatesToFetch.push(chunkDestination);
            }

            const response: ORSMDirectionsType = await fetchOSRMDirections(
                coordinatesToFetch,
            );

            allCoords = allCoords.concat(response.fullPath);
            allSteps = allSteps.concat(response.steps);

            currentOrigin = chunkDestination;
        }

        allCoords = removeDiscontinuities(allCoords);

        // @ts-ignore
        dispatch(setPolylineCoordsList(allCoords));
        dispatch(setDirectionSteps(allSteps));

    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
