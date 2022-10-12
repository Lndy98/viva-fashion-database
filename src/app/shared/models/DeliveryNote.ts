import { Custamer } from "./Custamer";
import { Item } from "./Item";

export interface DeliveryNote{
    number: string;
    date: Date;
    customer: Custamer;
    products: Item[];
    tax: string;
}