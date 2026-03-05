import {MarkerItem} from '@/types/Marker/MarkerType';

interface InputAddress {
    latitude: number;
    longitude: number;
}

export default function createMarkers(
    addresses: InputAddress[],
): MarkerItem[] {

    if (!addresses || addresses.length === 0) {
        return [];
    }

    const markers: MarkerItem[] = [];

    markers.push({
        latitude: addresses[0].latitude,
        longitude: addresses[0].longitude,
        title: 'Start',
    });

    for (let i = 1; i < addresses.length - 1; i++) {
        markers.push({
            latitude: addresses[i].latitude,
            longitude: addresses[i].longitude,
            title: `Stop ${i + 1}`,
        });
    }

    if (addresses.length > 1) {
        const last = addresses[addresses.length - 1];
        markers.push({
            latitude: last.latitude,
            longitude: last.longitude,
            title: 'End',
        });
    }

    return markers;
};
