import {DeliveryNote} from "../classes/DeliveryNote";
import {DeliveryNoteInterface} from "../models/DeliveryNoteInterface";
import {v4 as uuidv4} from "uuid";
import {Timestamp} from "@firebase/firestore";
import {Tax} from "../models/Tax";
import {DeliveryNotesService} from "../services/delivery-notes.service";

export class DeliveryNoteFactory {
  constructor( private readonly deliveryNoteService: DeliveryNotesService) { }
   create( customerId: string, products: [], type: string, tax: Tax, date: Timestamp, searchArray: []): DeliveryNoteInterface {
    return new DeliveryNote(
      uuidv4().toString(),
      this.generateDeliveryNoteNumber(),
      date,
      customerId,
      products,
      tax ?? Tax.full,
      type,
      searchArray
    );
  }
  static createEmpty(type:string){
    return new DeliveryNote(
      uuidv4().toString(),
      "this.generateDeliveryNoteNumber()",
      Timestamp.fromDate(new Date(new Date().toDateString())),
      "",
      [],
      Tax.full,
      type,
      []
    );
  }
  //TODO: deliveryNoteNumberCalculation test

  getDeliverNoteById(id:string){
    return this.deliveryNoteService.getById(id);
  }

  generateDeliveryNoteNumber() {
    let now = new Date();
    let number = this.deliveryNoteService.countInMonth(now).toString();
    return now.getFullYear() + "-" + (now.getMonth() + 1) + "-" +  number.padStart(4,"0");
  }

}
