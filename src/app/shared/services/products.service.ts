import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Product } from '../models/Product';
import { HttpClient } from '@angular/common/http';
import { limit } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  collectionName = 'Products';

  constructor(private http: HttpClient, private afs: AngularFirestore) { }

  getById(id: string) {
    return this.afs.collection<Product>(this.collectionName).doc(id).valueChanges();
  }
  getByNumber(productNumber: string){
    return this.afs.collection<Product>(this.collectionName, o => o.where('number', '==', productNumber)).valueChanges();
  }

  loadProduct(): Observable<Array<Product>>{
    return this.afs.collection<Product>(this.collectionName).valueChanges();
  }

  setProduct(product :Product){
    return this.afs.collection<Product>(this.collectionName).doc(product.id).set(product);
  }

  create(product: Product){
    return this.afs.collection<Product>(this.collectionName).doc(product.id).set(product);
  }
  getByNumberBetween(start: string, end:string) : Observable<Array<Product>>{
    return this.afs.collection<Product>(this.collectionName, o => o.where('number', '>=', start).where('number', '<', end)).valueChanges();
  }
  getByNumberStartWith(start: string): Observable<Array<Product>>{
    return this.afs.collection<Product>(this.collectionName, o => o.where('number', '>=', start)).valueChanges();
  }

  loadXProduct(): Observable<Array<Product>>{
    return this.afs.collection<Product>(this.collectionName, o => o.where('number', '<', 'k').orderBy('number').limit(50)).valueChanges();
  }

}