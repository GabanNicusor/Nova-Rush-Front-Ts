import {handleApiError} from '@/utils/apiErrorHandler';
import {ReviewType} from '@/types/enums/ReviewType';
import {CalculationType} from '@/types/enums/CalculationType';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface RatingPayload {
    address_id: string;
    reviewType: ReviewType;
    calculationType: CalculationType;
}

export default async function createOrUpdateRatingAddress(
    addressId: string,
    reviewType: ReviewType,
    calculationType: CalculationType,
): Promise<void> {
    const payload: RatingPayload = {
        address_id: addressId,
        reviewType: Number(reviewType),
        calculationType: Number(calculationType),
    };

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/v1/rating/address/createOrUpdateRatingAddress`,
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(payload),
            },
        );

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(
                `API request failed with status ${response.status}: ${errorBody}`,
            );
        }
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
