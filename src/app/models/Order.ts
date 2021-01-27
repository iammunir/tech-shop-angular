import { Item } from "./Item";

export interface Order {
    id: string;
    totalPrice: number;
    customerName: string;
    email: string;
    items: Item[];
}