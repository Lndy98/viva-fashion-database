import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeliveryNote } from 'src/app/shared/models/DeliveryNote';
import { DeliveryNotesService } from 'src/app/shared/services/delivery-notes.service';
import { FormControl, FormGroup } from '@angular/forms'
import { Custamer } from 'src/app/shared/models/Custamer';
import { map, Observable, startWith } from 'rxjs';
import { Util } from 'src/app/shared/interfaces/Util';
import { ProductInterface } from 'src/app/shared/models/ProductInterface';
import { LocalStorageServiceService } from 'src/app/shared/services/local-storage-service.service';

@Component({
  selector: 'app-delivery-note-list',
  templateUrl: './delivery-note-list.component.html',
  styleUrls: ['./delivery-note-list.component.scss'],
  providers: [Util]
})
export class DeliveryNoteListComponent implements OnInit {
  deliveryNotes:Array<DeliveryNote> = [];
  displayedColumns: string[] = ['number', 'date', 'custamer'];

  detailsForm = new FormGroup({
    productNumber: new FormControl(''),
    companyName: new FormControl(''),
    customer: new FormControl(''),
    date: new FormControl(),
    type: new FormControl('')
  });

  products: Array<ProductInterface> = [];
  customers: Array<Custamer> = [];
  filteredProducts !: Observable<ProductInterface[]>;
  filteredCustomer !: Observable<Custamer[]>;

  constructor(private router: Router, private deliveryNotesService: DeliveryNotesService, private util: Util, private localStorageServiceService:LocalStorageServiceService) { }
  ngOnInit(): void {
    this.detailsForm.get('type')?.setValue("outgoing");
    this.setDeliveryNotes();
    this.setCustomer();
    this.setProduct();
  }

  setCustomer() {
    // Az aszinkron adatbetöltést a subscribe-al végezzük el
    this.localStorageServiceService.getCustomers().subscribe(customers => {
      this.customers = customers;
      this.filteredCustomer = this.detailsForm.controls['companyName'].valueChanges.pipe(
        startWith(''),
        map(value => this._filterCustomer(value || '')),
      );
    });
  }
  setProduct(){
    this.localStorageServiceService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = this.detailsForm.controls['productNumber'].valueChanges.pipe(
        startWith(''),
        map(value => this._filterProduct(value || '')),
      );
    });
  }

  setDeliveryNotes(){
    this.deliveryNotesService.loadDeliveryNotesByType("outgoing").subscribe((data: Array<DeliveryNote>) => {
      console.log(data);
      this.deliveryNotes = data;
    })
  }

  _filterProduct(value: string) {
    const filterValue = value.toLowerCase();
    return this.products.filter(product => product.number.toLowerCase().includes(filterValue) );
  }
  _filterCustomer(value: string) {
    // A szűrési logika
    const filterValue = value.toLowerCase();
    return this.customers.filter(customer => customer.companyName.toLowerCase().includes(filterValue));
  }

  goToProductDetails(id: string) {
    this.router.navigate(['home/deliveryNote', id]);
  }
  search() {
    const { type, date, companyName, productNumber } = this.detailsForm.value;

    if (!type) {
      return;
    }

    let observable;

    if (date) {
      if (companyName && productNumber) {
        observable = this.deliveryNotesService
              .getByCustomerAndDateAndProductNumber(companyName,new Date(date),productNumber,type);
      } else if (companyName) {
        observable = this.deliveryNotesService
              .getByCustomerAndDate(companyName,new Date(date),type);
      } else if (productNumber) {
        observable = this.deliveryNotesService
              .getByDateAndProductNumber(new Date(date),productNumber, type);
      } else {
        observable = this.deliveryNotesService.getByDate(new Date(date), type);
      }
    } else if (companyName && productNumber) {
      observable = this.deliveryNotesService
              .getByCustomerAndProductNumber(companyName, productNumber, type );
    } else if (companyName) {
      observable = this.deliveryNotesService.getByCustomer(companyName, type);
    } else if (productNumber) {
      observable = this.deliveryNotesService.getByProduct(productNumber, type);
    } else {
      observable = this.deliveryNotesService.loadDeliveryNotesByType(type);
    }

    observable.subscribe((data: Array<DeliveryNote>) => {
      console.log(data);
      this.deliveryNotes = data;
    });
  }
}
