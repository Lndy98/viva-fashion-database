import { Custamer } from "./Custamer";
import { Item } from "./Item";

export interface DeliveryNote{
    id: string;
    number: string;
    date: string;
    customerId: string;
    products: Item[];
    tax: string;
}