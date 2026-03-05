import getAddressDetails from '../Get/getAddressDetails';
import createOrUpdateAddressDetails from '../Create/createOrUpdateAddressDetails';
import getRatingAddress from '../../RatingAddress/Get/getRatingAddress';
import createOrUpdateRatingAddress from '../../RatingAddress/Create/createOrUpdateRatingAddress';
import getStopDetails from '../../StopDetails/Get/getStopDetails';
import updateOrCreateStopDetails from '../../StopDetails/Create/updateOrCreateStopDetails';
import {handleApiError} from '@/utils/apiErrorHandler';
import {AddressItemComplete} from '@/types/Address/AddressType';
import {AddressDetailsItem, AddressDetailsItemComplete,} from '@/types/AddressDetails/AddressDetailsType';
import {RatingAddressItemComplete} from '@/types/RatingAddress/RatingAddressType';
import {StopDetailsType} from '@/types/StopDetails/StopDetailsType';
import {ReviewType} from '@/types/enums/ReviewType';
import {CalculationType} from '@/types/enums/CalculationType';
import {OrderType} from '@/types/enums/OrderType';
import {ExpressType} from '@/types/enums/ExpressType';
import {CustomAddressDetailsItem} from '@/types/AddressDetails/CustomAddressDetails';

export type FinalAddressDetailsList = CustomAddressDetailsItem[];

export default async function fetchAddressDetails(
    addressList: AddressItemComplete[],
    userId: string,
    list_id: string,
): Promise<FinalAddressDetailsList> {

    const addressDetailsList: CustomAddressDetailsItem[] = [];

    for (const address of addressList) {
        try {
            const addressDetail: AddressDetailsItemComplete | undefined = await getAddressDetails(userId, address.id);
            let ratingAddress: RatingAddressItemComplete | undefined = await getRatingAddress(address.id);
            let stopDetails: StopDetailsType | undefined = await getStopDetails(
                address.id,
                list_id,
                userId,
            );

            if (ratingAddress === null) {
                ratingAddress = (await createOrUpdateRatingAddress(
                    address.id,
                    ReviewType.safe_place_to_deliver,
                    CalculationType.INCREMENT,
                )) as unknown as RatingAddressItemComplete;
            }

            if (stopDetails === undefined || stopDetails === null) {
                stopDetails = (await updateOrCreateStopDetails(
                    userId,
                    address.id,
                    list_id,
                    1,
                    OrderType.DELIVERY,
                    ExpressType.TWELVE,
                )) as unknown as StopDetailsType;
            }


            if (addressDetail != null) {
                // @ts-ignore
                addressDetailsList.push({
                    selectedVote: ReviewType.safe_place_to_deliver,
                    ...addressDetail,
                    ...ratingAddress,
                    ...stopDetails,
                    address_complete: address.address_complete,
                    longitude: address.longitude,
                    latitude: address.latitude,
                });
            } else {
                await createOrUpdateAddressDetails(userId, address.id, '', '', '');

                const defaultAddressDetails: AddressDetailsItem = {
                    user_id: userId,
                    address_id: address.id,
                    name: '',
                    number: '',
                    notes: '',
                };

                // @ts-ignore
                addressDetailsList.push({
                    selectedVote: ReviewType.safe_place_to_deliver,
                    ...defaultAddressDetails,
                    ...ratingAddress,
                    ...stopDetails,
                    address_complete: address.address_complete,
                    latitude: address.latitude,
                    longitude: address.longitude,
                });
            }

        } catch (error) {
            handleApiError(error);
            throw error;
        }
    }
    return addressDetailsList;
};
