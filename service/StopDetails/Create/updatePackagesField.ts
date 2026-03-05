import {handleApiError} from '@/utils/apiErrorHandler';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type UserId = string;
type AddressId = string;
type ListId = string;
type PackagesCount = number;

interface PackagesPayload {
    user_id: UserId;
    address_id: AddressId;
    address_list_id: ListId;
    packages: PackagesCount;
}


export default async function updatePackages(
    userId: UserId,
    addressId: AddressId,
    addressListId: ListId,
    packages: PackagesCount,
): Promise<void> {

    const payload: PackagesPayload = {
        user_id: userId,
        address_id: addressId,
        address_list_id: addressListId,
        packages: packages,
    };

    try {
        const response: Response = await fetch(
            `${API_BASE_URL}/api/v1/stop-details/updatePackages`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            },
        );

        if (response.ok) {
            return await response.json();
        }

        console.error(
            `Failed to update packages count. Status: ${response.status}`,
        );
        return undefined;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
