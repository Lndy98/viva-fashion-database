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
  getById(id: string) {
    return this.afs.collection<DeliveryNote>(this.collectionName).doc(id).valueChanges();
  }
  getByDate(date: Date){
    return this.afs.collection<DeliveryNote>(this.collectionName, o => o.where('date', '>=', date.toString())).valueChanges();;
  }
  getByCustomer(customer: string){
    return this.afs.collection<DeliveryNote>(this.collectionName, o => o.where('customerId', '==', customer)).valueChanges();;
  }
  getByProduct(productNumber: string){
    return this.afs.collection<DeliveryNote>(this.collectionName, o => o.where('products.productNumber', '==', productNumber)).valueChanges();;
  }

}
