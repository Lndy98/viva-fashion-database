import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'
import { ProductService } from 'src/app/shared/services/products.service';
import { Product } from '../../shared/models/Product';
import { DeliveryNote } from '../../shared/models/DeliveryNote';
import { Custamer } from '../../shared/models/Custamer';
import { Item } from 'src/app/shared/models/Item';
import { Util } from 'src/app/shared/interfaces/Util';

import {MatTable} from '@angular/material/table';
import { v4 as uuidv4 } from 'uuid';
import { DeliveryNotesService } from 'src/app/shared/services/delivery-notes.service';
import { CustomersService } from 'src/app/shared/services/customers.service';
import { ActivatedRoute, Router } from '@angular/router';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { hrtime } from 'process';

@Component({
  selector: 'app-outgoing',
  templateUrl: './outgoing.component.html',
  styleUrls: ['./outgoing.component.scss'],
  providers: [Util]
})
export class OutgoingComponent implements OnInit {

  isNew: boolean = false;
  isItem: boolean = false;
  itemNumber: number = 0;  
  itemArray: Item [] = [];

  displayedColumns: string[] = ['id','productNumber','name', 'amount', 'price','payable', 'remove'];
  invalidStock : string[] = [];

  products !: Array<Product>;
  customers !: Array<Custamer>;
  filteredProducts !: Observable<Product[]>;
  filteredCustomer !: Observable<Custamer[]>;

  selectedProducts: Product [] = [];
  
  detailsForm = new FormGroup({
    customer: new FormControl(''),
    tax: new FormControl(''),
    date: new FormControl()
  });

  deliveryNote!: DeliveryNote;
  itemForm =  new FormGroup({
    productNumber: new FormControl(''),
    amount: new FormControl('')
  });

  deliveryNotes: DeliveryNote[] = [];
  
  @ViewChild (MatTable) table !: MatTable<Item>;

  constructor(private route: ActivatedRoute, private router: Router, private productService: ProductService,
      private deliveryNoteService: DeliveryNotesService, private customerService: CustomersService, public util: Util) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['id']){
        this.getDeliveryNote(params['id']);
      } else {
        this.isNew= true;
        this.setDeliveryNote();
      }
   });
    this.setCustomer();
    this.setProduct();
    console.log("A kezdo products: ")
    console.log(this.selectedProducts);
  }
  getDeliveryNote(id: string){
      this.deliveryNoteService.getById(id).subscribe(data =>{
        if(data){
          this.deliveryNote = data;
          
          this.itemArray = this.deliveryNote.products;
          this.isItem = true;
          this.itemNumber = this.itemArray.length;
  
          this.itemArray.forEach( item =>{
            this.productService.getByNumber(item.productNumber).subscribe(product =>{
              if(product){
                let pr = product[0];
                pr.stock = (+pr.stock + +item.amount).toString()
                this.selectedProducts.push(pr);
              }
            })
          })
          this.deliveryNote.searchArray = [];
          this.detailsForm.get('customer')?.setValue(this.deliveryNote.customerId);
          this.detailsForm.get('tax')?.setValue(this.util.getTaxToString(this.deliveryNote.tax));
          this.detailsForm.get('date')?.setValue(new Date(this.deliveryNote.date));
        }
      })
    
  }
  setDeliveryNote(){
    let now = new Date();
    let date = new Date(now.getFullYear().toString()+"-"+(now.getMonth()+1).toString());

    this.deliveryNoteService.getByMonth(date).subscribe((data : Array<DeliveryNote>) => {
      if(data){

       this.deliveryNote= {
          id: uuidv4(),
          number: this.generateDeliveryNoteNumber((data.length+3).toString()),
          date: "",
          customerId: "",
          products: [],
          tax: '27',
          type: 'outgoing',
          searchArray: []
        };
        this.detailsForm.get('tax')?.setValue(this.util.getTaxToString(this.deliveryNote.tax));
        }
    })
    }

    generateDeliveryNoteNumber(number: string){
      let now = new Date();
      if(number === "9999"){
        number = "0";
      }
      while(number.length<4){
        number = "0"+number;
      }
      return  now.getFullYear()+"-"+ (now.getMonth()+1)+"-"+number;
    }

  setProduct(){
    this.filteredProducts = this.itemForm.controls['productNumber'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterProduct(value||'')),
    );
  }

  setCustomer(){
    this.filteredCustomer = this.detailsForm.controls['customer'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomer(value||'')),
    );
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

  

  addItem(){
    if(this.itemForm.value.productNumber && this.itemForm.value.amount ){
      let product = this.getProduct(this.itemForm.value.productNumber);
      let amount = this.itemForm.value.amount;
      if(product){
        this.isItem = true;
        if(this.isInItemArray(this.itemForm.value.productNumber)){
          this.itemArray.forEach(element => {
            console.log(element.number == this.itemForm.value.productNumber)
            if(element.productNumber == this.itemForm.value.productNumber){
              console.log(element);
              element.amount = (+element.amount + amount).toString();
            }
          });
        } else{
          this.itemNumber += 1;
        let item : Item = ({
          number: this.itemNumber.toString(),
          productNumber: this.itemForm.value.productNumber,
          productName: product.name,
          price: product.price,
          amount: amount,
          incomingPrice: ''
        });
        this.itemArray.push(item);
        this.selectedProducts.push(product);
        }
        this.itemForm.reset();
        if(this.itemNumber > 1){
          this.table.renderRows();
        }
      }
    }
  }

  getProduct(productNumber: string): any{
    let product:Product|null = null;
    this.products.forEach(element => {
      if(element.number == productNumber){
        product = element;
      }
    });
    return product;
  }

  isInItemArray(productNumber: string){
    let isInArray = false;
    this.itemArray.forEach(element =>{
      if(element.productNumber == productNumber){
        isInArray = true;
      }
    })
    return isInArray;
  }

  checkStock(product: Product, amount: string){
    product.stock = (+this.util.formatNumber(product.stock) - +amount).toString();
    if(+product.stock < 0){
      this.invalidStock.push(product.number);
    }
  }
  
  removeElement(item: Item){
    const index = this.itemArray.indexOf(item);
    if (index !== -1) {
      this.itemArray.splice(index, 1);
    }
    this.itemNumber -= 1;
    if(this.itemNumber >= 1){
      this.table.renderRows();
    } else {
      this.isItem = false;
    }
  }

  calculateSumAmount(): number{
    let sum = 0;
    this.itemArray.forEach(item =>{
      sum += +item.amount;
    })
    return sum;
  }
  calculateSumPrice(): number{
    let sum = 0;
    this.itemArray.forEach(item =>{
      sum += +item.amount*+item.price;
    })
    return sum;
  }


  async save(){
    if(this.detailsForm.value.date && this.detailsForm.value.customer ){
      this.deliveryNote.tax = this.util.getTaxFromStrign(this.detailsForm.value.tax).toString();
      this.deliveryNote.customerId = this.detailsForm.value.customer;
      this.deliveryNote.date = this.detailsForm.value.date.toDateString();
      this.deliveryNote.products = this.itemArray;
      
      let modifyProductsList : Product[] = [];
      this.selectedProducts.forEach(async product =>{
        this.deliveryNote.searchArray.push(product.number);
        await this.util.takeItemAmountFromStock(product,this.itemArray);        
        modifyProductsList.push(product);
      })
      console.log("A kiválasztott termékek kódok listája:")
      console.log(this.deliveryNote.searchArray)
      
      this.deliveryNoteService.create(this.deliveryNote).then(_=>{
        modifyProductsList.forEach(async product  =>{
          await this.productService.setProduct(product);
       })

      })
      
      this.router.navigate(['home/deliveryNote', this.deliveryNote.id]);
      
      
    } 
  }



  cancel(){
    if(!this.isNew){
      this.router.navigate(['home/deliveryNote', this.deliveryNote.id]);
    } else{
      window.location.reload();
    }
  }
}
