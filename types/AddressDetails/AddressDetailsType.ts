interface addressDetailsItemComplete {
  id: number;
  createdAt: string;
  user_id: string;
  address_id: string;
  name: string;
  number: string;
  notes: string;
}

export type AddressDetailsItemComplete = addressDetailsItemComplete;

interface addressDetailsItem {
  user_id: string;
  address_id: string;
  name: string;
  number: string;
  notes: string;
}

export type AddressDetailsItem = addressDetailsItem;

