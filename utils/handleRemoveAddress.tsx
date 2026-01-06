// --- Imports from Service and State ---
import deleteAddressFromList from '../service/RouteAddressList/Delete/deleteAddressFromList';
import deleteAddressFromRouteStop from '../service/StopOrder/Delete/deleteAddressFromRouteStop';
import getAddressesByListId from '../service/RouteAddressList/Get/getAddressesByListId';
import getStopOrder from '../service/StopOrder/Get/getStopOrder';
import {
  setAddressDetailsList,
  setAddressList,
  setAddressListOrder,
  setMarkers,
} from '../state/navSlice';
import fetchAddressDetails from '../service/AddressDetails/Fetch/fetchAddressDetails';
import getUserId from '../service/User/Get/getUserId';
import createMarkers from './Map/createMarkers';
import deleteStopDetails from '../service/StopDetails/Delete/deleteStopDetails';

// --- Type Definitions (Based on previous conversions and standard Redux/API types) ---

// Assuming ID types (UUIDs/strings) and Redux Dispatch:
type AddressId = string;
type ListId = string;
type UserId = string;
import {AppDispatch} from "../state/store"
import { RouteStopListItem } from './Map/convertAddressListToRouteStopList';
import { AddressItemComplete } from '../types/Address/AddressType';
import { MarkerItem } from '../types/Marker/MarkerType';
import { CustomAddressDetailsItem } from '../types/AddressDetails/CustomAddressDetails';
import {StopOrderItem} from "../types/StopOrder/StopOrder";

// Define the assumed return types for the service functions used:
interface ServiceResult {
  success: boolean;
} // Example return for Delete/Update functions
type GetAddressesByListIdResult = AddressItemComplete[];
type FetchAddressDetailsResult = CustomAddressDetailsItem[];
// ---

/**
 * Handles the comprehensive process of removing an address from a route.
 * This involves deleting records across multiple services (AddressList, RouteStop, StopDetails),
 * fetching the new list/order, and updating the Redux state (AddressList, StopOrder, Details, Markers).
 * * @param address_id The ID of the address to remove.
 * @param address_id
 * @param list_id The ID of the route/list the address belongs to.
 * @param dispatch The Redux dispatch function.
 */
const handleRemoveAddress = async (
  address_id: AddressId,
  list_id: ListId,
  dispatch: AppDispatch,
): Promise<void> => {

  const user_id: UserId = await getUserId();

  try {
    // 1. Delete Operations (Await results are often not used, but typing them for clarity)
    // 1. Delete Operations (Await results are often not used, but typing them for clarity)
    (await deleteStopDetails(address_id, list_id)) as unknown as ServiceResult;
    (await deleteAddressFromList(list_id, address_id,)) as unknown as ServiceResult;
    (await deleteAddressFromRouteStop(list_id, address_id,)) as unknown as ServiceResult;

    // 2. Fetch New Data
    const addressList: GetAddressesByListIdResult = await getAddressesByListId(
      list_id,
    );
    const stopOrder: StopOrderItem[] | undefined = await getStopOrder(list_id);

    // 3. Update Redux State (AddressList and StopOrder)
    dispatch(setAddressList(addressList));
    dispatch(setAddressListOrder(stopOrder));

    // 4. Fetch and Update Address Details
    const addressDetailsList: FetchAddressDetailsResult =
      await fetchAddressDetails(addressList, user_id, list_id);
    dispatch(setAddressDetailsList(addressDetailsList));

    // 5. Create and Update Map Markers
    const markers: MarkerItem[] = createMarkers(addressList);
    dispatch(setMarkers(markers));
  } catch (error) {
    // Use error casting if you have a specific ApiError type
    console.error("Failed to update address list:", error);
  }
};

export default handleRemoveAddress;
