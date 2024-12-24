
import { Timestamp } from "@firebase/firestore";
import { Item } from "./Item";

export interface DeliveryNote{
    id: string;
    number: string;
    date: Timestamp;
    customerId: string;
    products: Item[];
    tax: string;
    type: string; //incoming or outgoing
    searchArray: string[];
}
export type DeliveryNoteKeys = keyof DeliveryNote;
//const deliveryNoteKeys: DeliveryNoteKeys[] = ['id', 'number', 'date', 'customerId', 'products', 'tax', 'type']