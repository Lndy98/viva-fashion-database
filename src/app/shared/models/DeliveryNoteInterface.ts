
import { Timestamp } from "@firebase/firestore";
import { ItemInterface } from "./ItemInterface";
import {Tax} from "./Tax";

export interface DeliveryNoteInterface {
    id: string;
    number: string;
    date: Timestamp;
    customerId: string;
    products: ItemInterface[];
    tax: Tax;
    type: string; //incoming or outgoing
    searchArray: string[];
}
export type DeliveryNoteKeys = keyof DeliveryNoteInterface;
//const deliveryNoteKeys: DeliveryNoteKeys[] = ['id', 'number', 'date', 'customerId', 'products', 'tax', 'type']
