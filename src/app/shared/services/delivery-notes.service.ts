import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {DeliveryNoteInterface} from '../models/DeliveryNoteInterface';
import {Timestamp} from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DeliveryNotesService {
  collectionName = 'DeliveryNotes';

  constructor(private afs: AngularFirestore) {
  }

  create(deliveryNote: DeliveryNoteInterface) {
    return this.afs.collection<DeliveryNoteInterface>(this.collectionName).doc(deliveryNote.id).set(deliveryNote);
  }

  loadDeliveryNotes(): Observable<Array<DeliveryNoteInterface>> {
    return this.afs.collection<DeliveryNoteInterface>(this.collectionName).valueChanges();
  }

  loadDeliveryNotesByType(type: string): Observable<Array<DeliveryNoteInterface>> {
    return this.afs.collection<DeliveryNoteInterface>(this.collectionName, o => o.where('type', '==', type).orderBy('date', 'desc').limit(100)).valueChanges();
  }

  getById(id: string) {
    return this.afs.collection<DeliveryNoteInterface>(this.collectionName).doc(id).valueChanges();
  }

  getByMonth(date: Date) {
    let start = Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth(), 1));
    let end = Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth(), 31));
    return this.afs.collection<DeliveryNoteInterface>(this.collectionName, o => o.where('date', '>=', start).where('date', '<=', end)).valueChanges();
  }

  countInMonth(date: Date):number {
    let start = Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth(), 1));
    let end = Timestamp.fromDate(new Date(date.getFullYear(), date.getMonth() + 1, 0));
    this.afs.collection(this.collectionName, o =>
      o.where('date', '>=', start).where('date', '<=', end)
    ).get().subscribe(snapshot => {
      return snapshot.size;
    });
    return 0;
  }

  getByDate(date: Date, type: string) {
    return this.afs.collection<DeliveryNoteInterface>(this.collectionName, o => o.where('date', '==', Timestamp.fromDate(date)).where('type', '==', type).orderBy('number', 'desc')).valueChanges();
  }

  getByCustomer(customer: string, type: string) {
    return this.afs.collection<DeliveryNoteInterface>(this.collectionName, o => o.where('customerId', '==', customer).where('type', '==', type).orderBy('number', 'desc')).valueChanges();
  }

  getByProduct(productNumber: string, type: string) {
    return this.afs.collection<DeliveryNoteInterface>(this.collectionName, o => o.where('searchArray', 'array-contains', productNumber).where('type', '==', type).orderBy('number', 'desc')).valueChanges();
  }

  getByCustomerAndDate(customer: string, date: Date, type: string) {
    return this.afs.collection<DeliveryNoteInterface>(this.collectionName, o => o.where('date', '==', Timestamp.fromDate(date)).where('type', '==', type).where('customerId', '==', customer).orderBy('number', 'desc')).valueChanges();
  }

  getByCustomerAndProductNumber(customer: string, productNumber: string, type: string) {
    return this.afs.collection<DeliveryNoteInterface>(this.collectionName, o => o.where('customerId', '==', customer).where('type', '==', type).where('searchArray', 'array-contains', productNumber).orderBy('number', 'desc')).valueChanges();

  }

  getByDateAndProductNumber(date: Date, productNumber: string, type: string) {
    return this.afs.collection<DeliveryNoteInterface>(this.collectionName, o => o.where('date', '==', Timestamp.fromDate(date)).where('type', '==', type).where('searchArray', 'array-contains', productNumber).orderBy('number', 'desc')).valueChanges();
  }

  getByCustomerAndDateAndProductNumber(customer: string, date: Date, productNumber: string, type: string) {
    return this.afs.collection<DeliveryNoteInterface>(this.collectionName, o => o.where('customerId', '==', customer).where('type', '==', type).where('date', '==', Timestamp.fromDate(date)).where('searchArray', 'array-contains', productNumber).orderBy('number', 'desc')).valueChanges();
  }

}
