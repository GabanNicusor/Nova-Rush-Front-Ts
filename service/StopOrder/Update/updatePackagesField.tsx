import { handleApiError } from '../../../utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

/**
 * Interface for the API response.
 * Update this based on what your backend actually returns (e.g., a success message or the updated object).
 */
interface StopDetailsResponse {
  success: boolean;
  message?: string;
  data?: any;
}

/**
 * Updates or creates stop details specifically for the package count.
 * * @param userId - The ID of the current user
 * @param userId
 * @param addressId - The ID of the specific stop/address
 * @param addressListId - The ID of the route/list this stop belongs to
 * @param packages - The number of packages to be set
 */
const updatePackagesField = async (
  userId: string,
  addressId: string,
  addressListId: string,
  packages: number,
): Promise<StopDetailsResponse | undefined> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/stop-details/updatePackages`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          address_id: addressId,
          address_list_id: addressListId,
          packages: packages,
        }),
      },
    );

    if (!response.ok) {
      return {
        success: true,
        message: "Updated successfully",
      };
    }
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export default updatePackagesField;
