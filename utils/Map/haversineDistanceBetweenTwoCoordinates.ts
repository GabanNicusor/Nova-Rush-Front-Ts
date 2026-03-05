type DegreeValue = number;

const toRad = (value: DegreeValue): number => (value * Math.PI) / 180;

const EARTH_RADIUS_KM: number = 6371;

export default function haversineDistanceBetweenTwoCoordinates(
    lat1?: DegreeValue,
    lon1?: DegreeValue,
    lat2?: DegreeValue,
    lon2?: DegreeValue
): number {

    if (lat1 === null || lat2 === null || lon1 === null || lon2 === null || lat1 === undefined || lat2 === undefined || lon2 === undefined || lon1 === undefined) {
        lat1 = 0.50;
        lat2 = 0.50;
        lon1 = 0.50;
        lon2 = 0.50;
    }
    const dLat: number = toRad(lat2 - lat1);
    const dLon: number = toRad(lon2 - lon1);

    const radLat1: number = toRad(lat1);
    const radLat2: number = toRad(lat2);

    const a: number =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) ** 2;

    const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceMeters: number = EARTH_RADIUS_KM * c * 1000;

    return parseFloat(distanceMeters.toFixed(1));
};
