import { handleApiError } from '../../../utils/apiErrorHandler';
import { AddressItemComplete } from '../../../types/Address/AddressType';


const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
// --- Type Definitions (Copy from above or import them) ---

interface AddAddressPayload {
  address_complete: string;
  latitude: number;
  longitude: number;
}

interface AddAddressResponse {
  success: boolean;
  message: string;
  data?: AddressItemComplete; // Keep this specific to your response
}

// --- The Converted Function ---

const addNewAddress = async (
  address_complete: string,
  latitude: number,
  longitude: number,
): Promise<AddAddressResponse> => {
  // Type checking the payload object being sent
  const payload: AddAddressPayload = {
    address_complete: address_complete,
    latitude,
    longitude,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/address/add-address`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // The response.json() will be typed as AddAddressResponse
    return (await response.json()) as AddAddressResponse;
  } catch (error) {

    handleApiError(error);
    throw error;
  }
};

export default addNewAddress;
