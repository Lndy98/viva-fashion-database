import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeliveryNote } from 'src/app/shared/models/DeliveryNote';
import { DeliveryNotesService } from 'src/app/shared/services/delivery-notes.service';
import { FormControl, FormGroup } from '@angular/forms'
import { ProductService } from 'src/app/shared/services/products.service';
import { Custamer } from 'src/app/shared/models/Custamer';
import { map, Observable, startWith } from 'rxjs';
import { Util } from 'src/app/shared/interfaces/Util';
import { Product } from 'src/app/shared/models/Product';
import { CustomersService } from 'src/app/shared/services/customers.service';

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

  products: Array<Product> = [];
  customers: Array<Custamer> = [];
  filteredProducts !: Observable<Product[]>;
  filteredCustomer !: Observable<Custamer[]>;

  constructor(private router: Router, private deliveryNotesService: DeliveryNotesService, private productService: ProductService,
    private customerService: CustomersService,private util: Util) { }
  ngOnInit(): void {
    this.detailsForm.get('type')?.setValue("outgoing");
    this.setDeliveryNotes();
    this.setCustomer();
    this.setProduct();
  }

  setCustomer(){
    this.filteredCustomer = this.detailsForm.controls['companyName'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomer(value||'')),
    );
  }
  setProduct(){
    this.filteredProducts = this.detailsForm.controls['productNumber'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterProduct(value||'')),
    );
  }

  setDeliveryNotes(){
    this.deliveryNotesService.loadDeliveryNotesByType("outgoing").subscribe((data: Array<DeliveryNote>) => {
      console.log(data);
      this.deliveryNotes = data;
    })
  }

  _filterProduct(value: string) {
    if(value.length === 0){
        this.products = [];
    }
    if(value.length === 2 || value.length > 2 && !this.products){
       this.searchProduct(value);
    }
    if(value.length >=3 && this.products){
      const filterValue = value.toLowerCase();
      return this.products.filter(product => product.number.toLowerCase().includes(filterValue) );
    }
    return [];
  }
   _filterCustomer(value: string) {
    if(value.length === 0 || value.length === 1){
        this.customers = [];
    }
    if(value.length == 2 ){
       this.searchCustomer(value);
    }
    if(value.length >=3){
      const filterValue = value.toLowerCase();
      return this.customers.filter(customer => customer.companyName.toLowerCase().includes(filterValue));
    }
    return [];
  }

  searchProduct(start: string){
    start = start.toUpperCase();
    let end = this.util.endPartOfSearch(start); 
    if(end == ''){
        this.productService.getByNumberStartWith(start).subscribe((data:Array<Product>)=>{
          this.products = data;
          })
    } else {
        this.productService.getByNumberBetween(start,end).subscribe((data: Array<Product>) => {
          this.products = data;
          })
     }
    }

    
  searchCustomer(start: string){
      start = start.toUpperCase();
      let end = this.util.endPartOfSearch(start);
      if(end == ''){
        this.customerService.getBySearchNameStartWith(start).subscribe((data:Array<Custamer>)=>{
          this.customers =  data;
          }) 
    } else {
        let end = this.util.endPartOfSearch(start);
        this.customerService.getBySearchNameBetween(start,end).subscribe((data: Array<Custamer>) => {
            this.customers =  data;
        })
     }
     
 }

  goToProductDetails(id: string) {
    this.router.navigate(['home/deliveryNote', id]);
  }
  search(){
    if(this.detailsForm.value.type){
      let type = this.detailsForm.value.type;
      if(this.detailsForm.value.date && !this.detailsForm.value.companyName && !this.detailsForm.value.productNumber){
        this.deliveryNotesService.getByDate(new Date(this.detailsForm.value.date), type).subscribe(data =>{
          if(data){
            this.deliveryNotes = data;
          }
        });
      }
      if(!this.detailsForm.value.date && this.detailsForm.value.companyName && !this.detailsForm.value.productNumber){
        this.deliveryNotesService.getByCustomer(this.detailsForm.value.companyName, type).subscribe(data =>{
          this.deliveryNotes = data;
        })
      }
      if(!this.detailsForm.value.date && !this.detailsForm.value.companyName && this.detailsForm.value.productNumber){
        this.deliveryNotesService.getByProduct(this.detailsForm.value.productNumber, type).subscribe(data =>{
          this.deliveryNotes = data;
        })
      }
      if(this.detailsForm.value.date && this.detailsForm.value.companyName && !this.detailsForm.value.productNumber){
        this.deliveryNotesService.getByCustomerAndDate(this.detailsForm.value.companyName,new Date(this.detailsForm.value.date), type).subscribe(data =>{
          this.deliveryNotes = data;
        })
      }
      if(!this.detailsForm.value.date && this.detailsForm.value.companyName && this.detailsForm.value.productNumber){
        this.deliveryNotesService.getByCustomerAndProductNumber(this.detailsForm.value.companyName,this.detailsForm.value.productNumber, type).subscribe(data =>{
          this.deliveryNotes = data;
        })
      }
      
      if(this.detailsForm.value.date && !this.detailsForm.value.companyName && this.detailsForm.value.productNumber){
        this.deliveryNotesService.getByDateAndProductNumber(this.detailsForm.value.date,this.detailsForm.value.productNumber, type).subscribe(data =>{
          this.deliveryNotes = data;
        })
      }
      if(this.detailsForm.value.date && this.detailsForm.value.companyName && this.detailsForm.value.productNumber){
        this.deliveryNotesService.getByCustomerAndDateAndProductNumber(this.detailsForm.value.companyName,this.detailsForm.value.date,
            this.detailsForm.value.productNumber, type).subscribe(data =>{
          this.deliveryNotes = data;
        })
      } 
      if(!this.detailsForm.value.date && !this.detailsForm.value.companyName && !this.detailsForm.value.productNumber){
        this.deliveryNotesService.loadDeliveryNotesByType(type).subscribe((data: Array<DeliveryNote>) => {
          console.log(data);
          this.deliveryNotes = data;
        })
      }
    }
  }
}
