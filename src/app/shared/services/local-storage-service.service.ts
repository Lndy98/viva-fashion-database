import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomersService } from './customers.service';
import { Custamer } from '../models/Custamer';
import { ProductService } from './products.service';
import { Product } from '../models/Product';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageServiceService {

  private customerKey = 'customer';
  private productKey = 'products';

  private customersSubject: BehaviorSubject<Custamer[]> = new BehaviorSubject<Custamer[]>([]);
  public customers$: Observable<Custamer[]> = this.customersSubject.asObservable();
  private productsSubject: BehaviorSubject<Product[]> = new BehaviorSubject<Product[]>([]);
  public products$: Observable<Product[]> = this.productsSubject.asObservable();
  
  constructor(private customersService: CustomersService, private productService: ProductService) { }


  getCustomers():Observable<Custamer[]>{
    const cachedItems = localStorage.getItem(this.customerKey);
    if(cachedItems){
     // Ha a localStorage-ban vannak adatok, akkor azokat visszaadjuk
     this.customersSubject.next(JSON.parse(cachedItems));
     return this.customers$;
    } else{
      return this.loadCustomersFromServer();
    }
  }
  updateCustomer(updatedCustomer: Custamer): void {
    const customers = this.customersSubject.value;
    const index = customers.findIndex((customer: { id: string; }) => customer.id === updatedCustomer.id);
    if (index !== -1) {
      //Ha a localStorage nem tartalmazza frissítjük azt
      customers[index] = updatedCustomer;
      this.customersSubject.next([...customers]);
      localStorage.setItem(this.customerKey, JSON.stringify(customers));
    }
  }
  getProducts():Observable<Product[]>{
    const cachedItems = localStorage.getItem(this.productKey);
    if(cachedItems){
     // Ha a localStorage-ban vannak adatok, akkor azokat visszaadjuk
     this.productsSubject.next(JSON.parse(cachedItems));
     return this.products$;
    } else{
      return this.loadProductsFromServer();
    }
  }
  updateProduct(updatedProduct: Product): void {
    const products = this.productsSubject.value;
    const index = products.findIndex((product: { id: string; }) => product.id === updatedProduct.id);
    if (index !== -1) {
      //Ha a localStorage nem tartalmazza frissítjük azt
      products[index] = updatedProduct;
      this.productsSubject.next([...products]);
      localStorage.setItem(this.customerKey, JSON.stringify(products));
    }
  }
  private loadProductsFromServer(): Observable<Product[]> {
    return this.productService.loadProduct().pipe(
      tap((products) => {
        this.cacheItems(this.productKey, JSON.stringify(products));
      })
    );
  }

  private loadCustomersFromServer(): Observable<Custamer[]> {
    return this.customersService.loadCustomer().pipe(
      tap((customers) => {
        // Ha sikeresen lekértük az adatokat, elmentjük őket a localStorage-ba
        this.cacheItems(this.customerKey, JSON.stringify(customers));
      })
    );
  }

  private cacheItems(storageKey: string ,items: string): void {
    localStorage.setItem(storageKey, items);
  }

  
}
