import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DeliveryNote } from '../models/DeliveryNote';
import { where } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DeliveryNotesService {

  collectionName = 'DeliveryNotes';

  constructor(private afs: AngularFirestore) { }

  create(deliveryNote: DeliveryNote){
    return this.afs.collection<DeliveryNote>(this.collectionName).doc(deliveryNote.id).set(deliveryNote);
  }
  loadDeliveryNotes(): Observable<Array<DeliveryNote>>{
    return this.afs.collection<DeliveryNote>(this.collectionName).valueChanges();
  }
  loadDeliveryNotesByType(type: string): Observable<Array<DeliveryNote>>{
    return this.afs.collection<DeliveryNote>(this.collectionName,o => o.where('type', '==', type)).valueChanges();
  }
  getById(id: string) {
    return this.afs.collection<DeliveryNote>(this.collectionName).doc(id).valueChanges();
  }
  getByMonth(date: Date){
    return this.afs.collection<DeliveryNote>(this.collectionName, o => o.where('date', '>=', date.toDateString())).valueChanges();
  }
  getByDate(date: Date, type: string){
    return this.afs.collection<DeliveryNote>(this.collectionName, o => o.where('date', '==', date.toDateString()).where('type', '==', type)).valueChanges();
  }
  getByCustomer(customer: string, type: string){
    return this.afs.collection<DeliveryNote>(this.collectionName, o => o.where('customerId', '==', customer).where('type', '==', type)).valueChanges();
  }
  getByProduct(productNumber: string, type: string){
    return this.afs.collection<DeliveryNote>(this.collectionName, o => o.where('searchArray', 'array-contains', productNumber).where('type', '==', type)).valueChanges();
  }
  getByCustomerAndDate(customer: string, date: Date, type: string){
    return this.afs.collection<DeliveryNote>(this.collectionName, o => o.where('date', '==', date.toDateString()).where('type', '==', type).where('customerId', '==', customer)).valueChanges();
  }
  getByCustomerAndProductNumber(customer: string, productNumber: string, type: string){
    return this.afs.collection<DeliveryNote>(this.collectionName, o => o.where('customerId', '==', customer).where('type', '==', type).where('searchArray', 'array-contains', productNumber)).valueChanges();
 
  }
  getByDateAndProductNumber(date: Date, productNumber: string, type: string){
    return this.afs.collection<DeliveryNote>(this.collectionName, o => o.where('date', '==', date.toDateString()).where('type', '==', type).where('searchArray', 'array-contains', productNumber)).valueChanges();
  }
  getByCustomerAndDateAndProductNumber(customer: string, date: Date, productNumber: string, type: string){
    return this.afs.collection<DeliveryNote>(this.collectionName, o => o.where('customerId', '==', customer).where('type', '==', type).where('date', '==', date.toDateString()).where('searchArray', 'array-contains', productNumber)).valueChanges();
  }

}
