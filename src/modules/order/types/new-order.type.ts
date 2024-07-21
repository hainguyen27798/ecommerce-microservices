import { OrderStatus } from '@/modules/order/constants';

type OrderProduct = {
    product: string;
    shop: string;
    quantity: number;
};

type ShippingInfo = {
    phone: string;
    country: string;
    province: string;
    district: string;
    commune: string;
    address: string;
};

export type NewOrderType = {
    user: string;
    orderProducts: OrderProduct[];
    totalPrice: number;
    totalPriceAfterDiscount: number;
    feeShip: number;
    shippingInfo: ShippingInfo;
    status: OrderStatus;
};
