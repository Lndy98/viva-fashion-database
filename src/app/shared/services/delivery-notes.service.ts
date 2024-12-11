import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { DeliveryNote } from '../models/DeliveryNote';
import { QuerySnapshot, Timestamp, where } from '@firebase/firestore';

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
    return this.afs.collection<DeliveryNote>(this.collectionName,o => o.where('type', '==', type).orderBy('date', 'desc').limit(100)).valueChanges();
  }
  getById(id: string) {
    return this.afs.collection<DeliveryNote>(this.collectionName).doc(id).valueChanges();
  }
  getByMonth(date: Date){
    let start = Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth(), 1));
    let end = Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth(), 31));
    return this.afs.collection<DeliveryNote>(this.collectionName, o => o.where('date', '>=', start).where('date', '<=', end)).valueChanges();
  }
  getByDate(date: Date, type: string){
    return this.afs.collection<DeliveryNote>(this.collectionName, o => o.where('date', '==', Timestamp.fromDate(date)).where('type', '==', type).orderBy('number', 'desc')).valueChanges();
  }
  getByCustomer(customer: string, type: string){
    return this.afs.collection<DeliveryNote>(this.collectionName, o => o.where('customerId', '==', customer).where('type', '==', type).orderBy('number', 'desc')).valueChanges();
  }
  getByProduct(productNumber: string, type: string){
    return this.afs.collection<DeliveryNote>(this.collectionName, o => o.where('searchArray', 'array-contains', productNumber).where('type', '==', type).orderBy('number', 'desc')).valueChanges();
  }
  getByCustomerAndDate(customer: string, date: Date, type: string){
    return this.afs.collection<DeliveryNote>(this.collectionName, o => o.where('date', '==', Timestamp.fromDate(date)).where('type', '==', type).where('customerId', '==', customer).orderBy('number', 'desc')).valueChanges();
  }
  getByCustomerAndProductNumber(customer: string, productNumber: string, type: string){
    return this.afs.collection<DeliveryNote>(this.collectionName, o => o.where('customerId', '==', customer).where('type', '==', type).where('searchArray', 'array-contains', productNumber).orderBy('number', 'desc')).valueChanges();
 
  }
  getByDateAndProductNumber(date: Date, productNumber: string, type: string){
    return this.afs.collection<DeliveryNote>(this.collectionName, o => o.where('date', '==', Timestamp.fromDate(date)).where('type', '==', type).where('searchArray', 'array-contains', productNumber).orderBy('number', 'desc')).valueChanges();
  }
  getByCustomerAndDateAndProductNumber(customer: string, date: Date, productNumber: string, type: string){
    return this.afs.collection<DeliveryNote>(this.collectionName, o => o.where('customerId', '==', customer).where('type', '==', type).where('date', '==', Timestamp.fromDate(date)).where('searchArray', 'array-contains', productNumber).orderBy('number', 'desc')).valueChanges();
  }

}
