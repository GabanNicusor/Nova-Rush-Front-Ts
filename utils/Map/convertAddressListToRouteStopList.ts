import { StopOrderItem } from '../../types/StopOrder/StopOrder';
import { AddressItemComplete } from '../../types/Address/AddressType'

export interface RouteStopListItem {
  address_id: string;
  new_stop: boolean;
}

// Map type for the intermediate object
type NewStopMap = Record<string, boolean>;

const convertAddressListToRouteStopList = (
  oldOrderedList: StopOrderItem[], // Corrected to use array type
  newOrderedList: AddressItemComplete[], // Corrected to use array type
): StopOrderItem[] => {
  // Returns the array type

  try {
    // 1. Create a map of address_id to new_stop from the oldOrderedList
    const originalOrderMap: NewStopMap = oldOrderedList.reduce(
      (acc, { address_id, new_stop }) => {
        // Use address_id as the key
        acc[address_id] = new_stop;
        return acc;
      },
      {} as NewStopMap, // Initialize the accumulator
    );

    // 2. Generate the route stop list based on the newOrderedList
    return newOrderedList.map((address: AddressItemComplete) => ({
      // Use 'address.id' from the new list as 'address_id' for the output
      address_id: address.id,
      // Look up 'new_stop' status from the map, defaulting to true if the ID is new
      new_stop: originalOrderMap[address.id] ?? true,
    }));
  } catch (error) {
    console.error(
      'Error creating RouteStop List in convertAddressListToRouteStopList:',
      error,
    );
    // Return an empty array in case of error, matching the function's defined return type.
    return [];
  }
};

export default convertAddressListToRouteStopList;
