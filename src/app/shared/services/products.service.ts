import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ProductInterface } from '../models/ProductInterface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  collectionName = 'Products';

  constructor(private http: HttpClient, private afs: AngularFirestore) { }

  getById(id: string) {
    return this.afs.collection<ProductInterface>(this.collectionName).doc(id).valueChanges();
  }
  getByNumber(productNumber: string){
    return this.afs.collection<ProductInterface>(this.collectionName, o => o.where('number', '==', productNumber)).valueChanges();
  }

  loadProduct(): Observable<Array<ProductInterface>>{
    return this.afs.collection<ProductInterface>(this.collectionName).valueChanges();
  }

  setProduct(product :ProductInterface){
    return this.afs.collection<ProductInterface>(this.collectionName).doc(product.id).set(product);
  }

  create(product: ProductInterface){
    return this.afs.collection<ProductInterface>(this.collectionName).doc(product.id).set(product);
  }
  getByNumberBetween(start: string, end:string) : Observable<Array<ProductInterface>>{
    return this.afs.collection<ProductInterface>(this.collectionName, o => o.where('number', '>=', start).where('number', '<', end)).valueChanges();
  }
  getByNumberStartWith(start: string): Observable<Array<ProductInterface>>{
    return this.afs.collection<ProductInterface>(this.collectionName, o => o.where('number', '>=', start)).valueChanges();
  }

  loadXProduct(): Observable<Array<ProductInterface>>{
    return this.afs.collection<ProductInterface>(this.collectionName, o => o.where('number', '<', 'k').orderBy('number').limit(50)).valueChanges();
  }

}
