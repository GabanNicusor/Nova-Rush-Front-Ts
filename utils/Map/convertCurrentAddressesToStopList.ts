
// 1. Interface for an item in the input 'addresses' array
interface CurrentAddressItem {
  id: string; // The unique identifier used for the address_id
  // The input list likely contains other address data (name, coords, etc.)
}

// 2. Interface for the OUTPUT item
// This is the desired structure for the stop list (identical to RouteStopListItem
// from the previous conversion).
export interface RouteStopListItem {
  address_id: string;
  new_stop: boolean;
}

// ---

/**
 * Converts an array of addresses into the RouteStopListItem format,
 * explicitly marking all stops as existing (new_stop: false).
 * @param addresses An array of address objects, each having an 'id'.
 * @returns An array of RouteStopListItem objects, or an empty array if the input is invalid.
 */
const convertCurrentAddressesToStopList = (
  addresses: CurrentAddressItem[] | any
): RouteStopListItem[] => {

  // 1. Type Guard: Use Array.isArray for runtime validation, but rely on
  // the function signature for static type checking when possible.
  if (!Array.isArray(addresses)) {
    console.warn('Input to convertCurrentAddressesToStopList was not an array.');
    return [];
  }

  // 2. Map and Type Assertion: TypeScript knows the map returns RouteStopListItem[]
  return addresses.map((address: CurrentAddressItem) => ({
    address_id: address.id,
    new_stop: false, // Explicitly set to false for existing stops
  }));
}

export default convertCurrentAddressesToStopList;
