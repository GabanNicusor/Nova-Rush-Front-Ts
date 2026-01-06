import { handleApiError } from '../../../utils/apiErrorHandler';
import { OrderType } from '../../../types/enums/OrderType';
import { ExpressType } from '../../../types/enums/ExpressType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
type UserId = string;
type AddressId = string;
type ListId = string;
type PackagesType = number;

interface StopDetailsPayload {
  user_id: UserId;
  address_id: AddressId;
  address_list_id: ListId;
  packages: PackagesType;
  orderType: OrderType;
  expressType: ExpressType;
}

interface StopDetailsResponse {
  success: boolean;
  message: string;
  stop_details_id: string;
}
// ---

const UpdateOrCreateStopDetails = async (
  userId: UserId,
  addressId: AddressId,
  addressListId: string | '',
  packages: PackagesType,
  orderType: OrderType,
  expressType: ExpressType,
): Promise<StopDetailsResponse | undefined> => {
  // Returns the parsed JSON response or undefined/throws

  // 1. Construct the payload object with type safety
  const payload: StopDetailsPayload = {
    user_id: userId,
    address_id: addressId,
    address_list_id: addressListId,
    packages: packages,
    orderType: Number(orderType),
    expressType: Number(expressType)
  };


  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/stop-details/updateOrCreateStopDetails`,
      {
        method: 'POST', // Note: A PUT or PATCH might be semantically better for an upsert
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );
    // Check if the response was successful (HTTP status 200-299)
    if (response.ok) {
      // Return the parsed JSON response, cast to the expected type
      return await response.json();
    }

    // If not successful but no network error occurred
    console.error(
      `Failed to update/create stop details. Status: ${response.status}`,
    );
    return undefined;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
export default UpdateOrCreateStopDetails;
