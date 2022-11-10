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
    this.loadDeliveryNotes().subscribe((data: Array<DeliveryNote>) => {
      return data.filter(deliveryNote => new Date(deliveryNote.date) > date);
    })
    return new Array<DeliveryNote>;
  }
  getActualMonthSize(){
    let now = new Date();
    let date = new Date(now.getFullYear().toString()+"-"+(now.getMonth()+1).toString());
    let deliveryNotes = this.getByDate(date);
    return deliveryNotes.length;
  }
  
}
