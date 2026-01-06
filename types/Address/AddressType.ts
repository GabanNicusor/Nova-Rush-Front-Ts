interface addressItemComplete {
  id: string;
  createdAt: string;
  address_complete: string;
  latitude: number;
  longitude: number;
}

export type AddressItemComplete = addressItemComplete;

interface addressItem {
  id: string;
  address_complete: string;
  latitude: number;
  longitude: number;
}

export type AddressItem = addressItem;
