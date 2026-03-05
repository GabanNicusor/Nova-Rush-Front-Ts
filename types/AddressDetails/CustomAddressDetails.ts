import { AddressDetailsItemComplete } from './AddressDetailsType';
import { RatingAddressItemComplete } from '../RatingAddress/RatingAddressType';
import { StopDetailsType } from '../StopDetails/StopDetailsType';
import { ReviewType } from '../enums/ReviewType';

export interface customAddressDetailsItem
  extends Pick<
      AddressDetailsItemComplete,
      'address_id' | 'user_id' | 'name' | 'number' | 'notes'
    >,
    Pick<
      RatingAddressItemComplete,
      | 'safe_place_to_deliver'
      | 'between_safe_place_and_unsafe_place'
      | 'unsafe_place_to_deliver'
    >,
    Pick<
      StopDetailsType,
      'address_list_id' | 'packages' | 'OrderType' | 'ExpressType'
    > {
  address_complete: string;
  selectedVote: ReviewType;
  latitude: number;
  longitude: number;
}


export type CustomAddressDetailsItem = customAddressDetailsItem;
