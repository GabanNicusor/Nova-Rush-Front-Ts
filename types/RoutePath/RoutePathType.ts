import { StopOrderItem } from '../StopOrder/StopOrder';

interface routePathItem {
    id: string,
    polyline: string;
    user_id: string;
    route_id: string;
    stop_order: StopOrderItem[];
}

export type RoutePathItem = routePathItem;
