import { OrderType } from '../enums/OrderType';
import { ExpressType } from '../enums/ExpressType';

interface stopDetailsItem {
  id: string;
  createdAt: string;
  user_id: string;
  address_id: string;
  address_list_id: string;
  packages: number;
  OrderType: OrderType;
  ExpressType: ExpressType;
}

export type StopDetailsType = stopDetailsItem;
