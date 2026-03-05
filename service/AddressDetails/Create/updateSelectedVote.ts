import {handleApiError} from '@/utils/apiErrorHandler';
import {ReviewType} from '@/types/enums/ReviewType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;


interface VotePayload {
    reviewType: ReviewType;
    address_id: string;
    user_id: string;
}

interface VoteUpdateResponse {
    success: boolean;
    message: string;
}

export default async function updateSelectedVote(
    addressId: string,
    selectedVote: ReviewType,
    userId: string,
): Promise<void> {

    const payload: VotePayload = {
        reviewType: Number(selectedVote),
        address_id: addressId,
        user_id: userId,
    };

    try {
        const url = `${API_BASE_URL}/api/v1/address-details/updateSelectedVote`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody: VoteUpdateResponse = await response.json();
            throw new Error(
                errorBody.message || `Request failed with status ${response.status}`,
            );
        }
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
