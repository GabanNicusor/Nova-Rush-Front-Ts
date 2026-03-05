// Service
import GetUserId from '../../User/Get/getUserId';
import {createOrUpdateRoutePath} from '@/service/Map/Create/createOrUpdateRoutePath';

import polyline from '@mapbox/polyline';
import {handleApiError} from '@/utils/apiErrorHandler';

type NodeIndex = number;
type RouteId = string;

interface Coordinate {
    latitude: number;
    longitude: number;
}

export default async function getShorterPolyline(
    polylineNodes: Coordinate[],
    currentNode: NodeIndex,
    addressListId: RouteId,
): Promise<Coordinate[]> {
    try {
        const clippedPolylineNodes: Coordinate[] =
            polylineNodes.slice(currentNode);

        const user_id: string = await GetUserId();

        await createOrUpdateRoutePath(
            polyline.encode(
                clippedPolylineNodes.map(coordinates => [coordinates.latitude, coordinates.longitude] as [number, number])
            ),
            [],
            user_id,
            addressListId,
        );

        return clippedPolylineNodes;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
