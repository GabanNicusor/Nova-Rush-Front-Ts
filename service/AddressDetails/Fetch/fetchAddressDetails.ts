import getAddressDetails from '../Get/getAddressDetails';
import createOrUpdateAddressDetails from '../Create/createOrUpdateAddressDetails';
import getRatingAddress from '../../RatingAddress/Get/getRatingAddress';
import createOrUpdateRatingAddress from '../../RatingAddress/Create/createOrUpdateRatingAddress';
import getStopDetails from '../../StopDetails/Get/getStopDetails';
import updateOrCreateStopDetails from '../../StopDetails/Create/updateOrCreateStopDetails';
import {handleApiError} from '../../../utils/apiErrorHandler';
import {AddressItemComplete} from '../../../types/Address/AddressType';
import {
    AddressDetailsItem,
    AddressDetailsItemComplete,
} from '../../../types/AddressDetails/AddressDetailsType';
import {RatingAddressItemComplete} from '../../../types/RatingAddress/RatingAddressType';
import {StopDetailsType} from '../../../types/StopDetails/StopDetailsType';
import {ReviewType} from '../../../types/enums/ReviewType';
import {CalculationType} from '../../../types/enums/CalculationType';
import {OrderType} from '../../../types/enums/OrderType';
import {ExpressType} from '../../../types/enums/ExpressType';
import {CustomAddressDetailsItem} from '../../../types/AddressDetails/CustomAddressDetails';

export type FinalAddressDetailsList = CustomAddressDetailsItem[];
// ---

const fetchAddressDetails = async (
    addressList: AddressItemComplete[], // Explicitly type the input array
    userId: string, // Explicitly type the input
    list_id: string, // Explicitly type the input
): Promise<FinalAddressDetailsList> => {
    // Explicitly type the return promise

    const addressDetailsList: CustomAddressDetailsItem[] = [];

    for (const address of addressList) {
        try {
            // Fetch initial records (assuming they return the defined types or null)
            const addressDetail: AddressDetailsItemComplete | undefined = await getAddressDetails(userId, address.id);
            let ratingAddress: RatingAddressItemComplete | undefined = await getRatingAddress(address.id);
            let stopDetails: StopDetailsType | undefined = await getStopDetails(
                address.id,
                list_id,
                userId,
            );

            // 1. Create default Rating if null
            if (ratingAddress === null) {
                // Assuming createOrUpdateRatingAddress returns the new RatingAddress object
                ratingAddress = (await createOrUpdateRatingAddress(
                    address.id,
                    ReviewType.safe_place_to_deliver,
                    CalculationType.INCREMENT,
                )) as unknown as RatingAddressItemComplete;
            }

            // 2. Create default StopDetails if null
            if (stopDetails === undefined || stopDetails === null) {
                // Assuming updateOrCreateStopDetails returns the new StopDetails object
                stopDetails = (await updateOrCreateStopDetails(
                    userId,
                    address.id,
                    list_id,
                    1,
                    OrderType.DELIVERY,
                    ExpressType.TWELVE,
                )) as unknown as StopDetailsType;
            }

            // TypeScript now guarantees ratingAddress and stopDetails are not null here

            if (addressDetail != null) {
                // Case 1: Detail exists. Merge all records.
                // The merged object is implicitly cast to AddressDetailsItem
                addressDetailsList.push({
                    selectedVote: ReviewType.safe_place_to_deliver,
                    ...addressDetail,
                    ...ratingAddress,
                    ...stopDetails,
                    address_complete: address.address_complete
                });
            } else {
                // Case 2: Detail does NOT exist. Create default record and merge.

                // Create default in DB (no need to await a return value here)
                await createOrUpdateAddressDetails(userId, address.id, '', '', '');

                // Define local default object (must conform to AddressDetail)
                const defaultAddressDetails: AddressDetailsItem = {
                    user_id: userId,
                    address_id: address.id,
                    name: '',
                    number: '',
                    notes: '',
                };

                // Push local default object merged with other data
                addressDetailsList.push({
                    selectedVote: ReviewType.safe_place_to_deliver,
                    ...defaultAddressDetails,
                    ...ratingAddress,
                    ...stopDetails,
                    address_complete: address.address_complete
                });
            }

        } catch (error) {
            handleApiError(error);
            throw error;
        }
    }
    return addressDetailsList;
};

export default fetchAddressDetails;
