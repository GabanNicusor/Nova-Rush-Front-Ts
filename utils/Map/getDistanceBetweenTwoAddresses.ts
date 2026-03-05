import haversineDistanceBetweenTwoCoordinates from './haversineDistanceBetweenTwoCoordinates';

interface Coordinate {
    latitude: number;
    longitude: number;
}

interface UserLocation {
    speed?: number;
    heading?: number;
    accuracy?: number;
    latitude?: number;
    longitude?: number
}

interface Node extends Coordinate {
    [key: string]: any;
}

interface DistanceResult {
    index: number;
    distance: number;
}

export default function getDistanceBetweenTwoAddresses(
    userLocation: UserLocation,
    nodes: Node[],
    lastIndex: number = 0
): DistanceResult[] {
    if (!nodes || nodes.length === 0) return [];

    const MAX_DISTANCE_FROM_PATH = 0.1;
    const windowSize = 50;
    const searchArea = nodes.slice(lastIndex, lastIndex + windowSize);

    if (searchArea.length === 0) {
        return [{index: lastIndex, distance: 0}];
    }

    const localDistances = searchArea.map((node, i) => {
        return {
            index: lastIndex + i,
            distance: haversineDistanceBetweenTwoCoordinates(
                userLocation.latitude,
                userLocation.longitude,
                node.latitude,
                node.longitude,
            ),
        };
    });

    localDistances.sort((a, b) => a.distance - b.distance);

    const closest = localDistances[0];

    if (!closest || closest.distance > MAX_DISTANCE_FROM_PATH) {
        return [{index: lastIndex, distance: 0}];
    }

    const currentSpeed = userLocation.speed ?? 0;

    let lookahead = 0;
    if (currentSpeed > 50 && currentSpeed <= 100) lookahead = 1;
    if (currentSpeed > 100) lookahead = 2;

    const finalIndex = Math.min(closest.index + lookahead, nodes.length - 1);

    return [{
        index: finalIndex,
        distance: closest.distance
    }];
};
