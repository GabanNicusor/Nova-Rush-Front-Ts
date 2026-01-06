import polyline from '@mapbox/polyline';
import { AppDispatch } from '../../../state/store';

// Utils
import convertAddressListToRouteStopList from '../../../utils/Map/convertAddressListToRouteStopList';
import convertCurrentAddressesToStopList from '../../../utils/Map/convertCurrentAddressesToStopList';

// Service
import {createOrUpdateRoutePath} from '../../Map/Create/createOrUpdateRoutePath';
import fetchAddressesForSelectedList from '../../Address/Fetch/fetchAddressesForSelectedList';
import updateRouteAddressList from '../../RouteAddressList/Update/updateRouteAddressList';
import { AddressItemComplete } from '../../../types/Address/AddressType';
import { StopOrderItem } from '../../../types/StopOrder/StopOrder';

// --- Type Definitions (Imported or Defined Here) ---
interface Coordinate {
  latitude: number;
  longitude: number;
}

type RouteId = string;
type UserId = string;
// ---

const updateStopOrder = async (
  oldOrderedList: StopOrderItem[] | null, // Original list, can be null
  allCoords: Coordinate[], // Array of coordinates defining the new path
  userId: UserId,
  listId: RouteId,
  newOrderedList: AddressItemComplete[], // The newly calculated/reordered list
  dispatch: AppDispatch,
): Promise<void> => {

  // Exit early if critical data is missing (type-safe check)
  if (
    !allCoords ||
    allCoords.length === 0 ||
    !newOrderedList ||
    newOrderedList.length === 0
  ) {
    console.log('Skipping updateStopOrder due to missing data');
    return;
  }

  // 1. Encode the new polyline path
  const encodedPolyline: string = polyline.encode(
    allCoords.map(({ latitude, longitude }) => [latitude, longitude]),
  );

  let addressIdsInOrder: StopOrderItem[];

  // 2. Determine the stop ID array based on list existence
  if (oldOrderedList && oldOrderedList.length > 0) {
    // Use mapping logic for an existing list
    addressIdsInOrder = convertAddressListToRouteStopList(
      oldOrderedList,
      newOrderedList,
    );
  } else {
    // Use mapping logic for a list where addresses were just added/fetched
    addressIdsInOrder = convertCurrentAddressesToStopList(newOrderedList);
  }

  // 3. Perform backend and Redux updates
  try {
    // A. Refresh addresses in Redux state (necessary before B/C?)
    await fetchAddressesForSelectedList(listId, dispatch);

    // B. Update the route's stop order on the backend
    await updateRouteAddressList(addressIdsInOrder, listId);

    // C. Save the new polyline path data on the backend
    await createOrUpdateRoutePath(
      encodedPolyline,
      addressIdsInOrder,
      userId,
      listId,
    );
  } catch (error) {
    // Log the error but don't re-throw unless necessary, as this is an orchestration function
    console.error('Error during route stop order update:', error);
  }
  // Note: The original JS did not have a catch block here, but it's added for robustness.
  // If you need the calling function to handle the error, add: throw error;
};

export default updateStopOrder;
