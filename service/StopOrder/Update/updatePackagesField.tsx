import {handleApiError} from '@/utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface StopDetailsResponse {
    success: boolean;
    message?: string;
    data?: any;
}


export default async function updatePackagesField(
    userId: string,
    addressId: string,
    addressListId: string,
    packages: number,
): Promise<StopDetailsResponse | undefined> {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/v1/stop-details/updatePackages`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
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
