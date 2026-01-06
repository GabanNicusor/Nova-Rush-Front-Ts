interface ratingAddressItemComplete {
  id: number;
  createdAt: string;
  address_id: string;
  safe_place_to_deliver: number;
  between_safe_place_and_unsafe_place: number;
  unsafe_place_to_deliver: number;
}

export type RatingAddressItemComplete = ratingAddressItemComplete;
