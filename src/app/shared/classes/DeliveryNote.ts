import {DeliveryNoteInterface} from "../models/DeliveryNoteInterface";
import {Timestamp} from "@firebase/firestore";
import {ItemInterface} from "../models/ItemInterface";
import {Tax} from "../models/Tax";

export class DeliveryNote implements DeliveryNoteInterface {
  constructor(
    public id: string,
    public number: string,
    public date: Timestamp,
    public customerId: string,
    public products: ItemInterface[],
    public tax: Tax,
    public type: string, //incoming or outgoing
    public searchArray: string[],
  ) {  }
}
