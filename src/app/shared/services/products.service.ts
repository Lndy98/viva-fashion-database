import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Product } from '../models/Product';
import { HttpClient } from '@angular/common/http';

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
}