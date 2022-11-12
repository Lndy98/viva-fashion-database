import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Custamer } from '../models/Custamer';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  collectionName = 'Customers';

  constructor(private afs: AngularFirestore) { }

  getCustamerById(id: string){
    return this.afs.collection<Custamer>(this.collectionName).doc(id).valueChanges();
  }

  loadCustomer(): Observable<Array<Custamer>>{
    return this.afs.collection<Custamer>(this.collectionName).valueChanges();
  }
  
  create(custamer: Custamer){
    return this.afs.collection<Custamer>(this.collectionName).doc(custamer.id).set(custamer);
  }
}