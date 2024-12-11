import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CustomersService } from './customers.service';
import { Custamer } from '../models/Custamer';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageServiceService {

  private customerKey = 'customer';
  private customersSubject: BehaviorSubject<Custamer[]> = new BehaviorSubject<Custamer[]>([]);
  public customers$: Observable<Custamer[]> = this.customersSubject.asObservable();
  
  constructor(private customersService: CustomersService) { }


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

   // Update a customer and save the changes to localStorage
   updateCustomer(updatedCustomer: Custamer): void {
    const customers = this.customersSubject.value;
    const index = customers.findIndex((customer: { id: string; }) => customer.id === updatedCustomer.id);
    if (index !== -1) {
      customers[index] = updatedCustomer; // Update the customer in the array
      this.customersSubject.next([...customers]); // Emit the updated array
      localStorage.setItem(this.customerKey, JSON.stringify(customers)); // Save to localStorage
    }
  }
}
