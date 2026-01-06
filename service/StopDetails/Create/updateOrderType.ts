import { handleApiError } from '../../../utils/apiErrorHandler';
import { OrderType } from '../../../types/enums/OrderType';
import { ExpressType } from '../../../types/enums/ExpressType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// --- Type Definitions (Imported or Defined Here) ---
type UserId = string;
type AddressId = string;
type ListId = string;
type Packages = number

interface OrderTypePayload {
  user_id: UserId;
  address_id: AddressId;
  packages: Packages;
  address_list_id: ListId;
  orderType: OrderType;
  expressType: ExpressType;
}

interface UpdateSuccessResponse {
  success: boolean;
  message: string;
  updated_address_id: AddressId;
}
// ---

const updateOrderType = async (
  userId: UserId, // Explicitly type the user ID
  addressId: AddressId, // Explicitly type the address ID
  addressListId: ListId, // Explicitly type the address list ID
  orderType: OrderType, // Explicitly type the order type
): Promise<UpdateSuccessResponse | undefined> => {
  // Returns the parsed JSON response or undefined/throws

  // 1. Construct the payload object with type safety
  const payload: OrderTypePayload = {
    user_id: userId,
    address_id: addressId,
    address_list_id: addressListId,
    packages: 1,
    expressType: 5,
    orderType: Number(orderType),
  };

  try {
    const response: Response = await fetch(
      `${API_BASE_URL}/api/v1/stop-details/updateOrderType`,
      {
        method: 'POST', // Note: A PUT request might be semantically better for an update
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      },
    );

    // Check if the response was successful (HTTP status 200-299)
    if (response.ok) {
      // Since the backend is void, there is no JSON to parse.
      // We manually return a success object or just true.
      return {
        success: true,
        message: "Updated successfully",
        updated_address_id: addressId
      };
    }

  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
export default updateOrderType;
