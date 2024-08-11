export type InventoryType = {
    product: string;
    shop: string;
    stock: number;
    location?: string;
    reservation?: object[];
};
