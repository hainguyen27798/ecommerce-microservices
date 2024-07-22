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

type PaymentInfo = {
    paymentMethod: string;
    paymentStatus: string;
};

type DiscountInfo = {
    shop: string;
    code: string;
};

export type NewOrderType = {
    user: string;
    orderProducts: OrderProduct[];
    totalPrice: number;
    totalPriceAfterDiscount: number;
    feeShip: number;
    shippingInfo: ShippingInfo;
    status: OrderStatus;
    paymentInfo: PaymentInfo;
    discountInfos: DiscountInfo[];
    note?: string;
};
