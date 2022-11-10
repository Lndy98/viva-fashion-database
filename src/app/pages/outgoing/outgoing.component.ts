import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'
import { ProductService } from 'src/app/shared/services/products.service';
import { Product } from '../../shared/models/Product';
import { DeliveryNote } from '../../shared/models/DeliveryNote';
import { Custamer } from '../../shared/models/Custamer';
import { Item } from 'src/app/shared/models/Item';
import {MatTable} from '@angular/material/table';
import { v4 as uuidv4 } from 'uuid';
import { DeliveryNotesService } from 'src/app/shared/services/delivery-notes.service';
import { CustomersService } from 'src/app/shared/services/customers.service';
import { Router } from '@angular/router';

import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-outgoing',
  templateUrl: './outgoing.component.html',
  styleUrls: ['./outgoing.component.scss']
})
export class OutgoingComponent implements OnInit {

  isItem: boolean = false;
  itemNumber: number = 0;
  
  itemArray: Item [] = [];
  displayedColumns: string[] = ['id','productNumber', 'amount', 'price', 'payable', 'remove'];
  invalidStock : string[] = [];
  sumAmount : number = 0;
  sumPrice : number = 0; 


  allProducts !: Array<Product>;
  filteredProducts !: Observable<Product[]>;
  customer !: Array<Custamer>;
  filteredCustomer !: Observable<Custamer[]>;
  
  detailsForm = new FormGroup({
    customer: new FormControl(''),
    tax: new FormControl(''),
    date: new FormControl(new Date())
  });

  deliveryNoteNumber!: string;
  itemForm =  new FormGroup({
    productNumber: new FormControl(''),
    amount: new FormControl('')
  });

  deliveryNotes: DeliveryNote[] = [];
  
  @ViewChild (MatTable) table !: MatTable<Item>;

  constructor(private router: Router, private productService: ProductService,
      private deliveryNoteService: DeliveryNotesService, private customerService: CustomersService) { }

  ngOnInit(): void {
    this.setCustomer();
    this.setProduct();
    this.setDeliveryNote();
  }

  setProduct(){
    this.productService.loadProduct().subscribe((data: Array<Product>) => {
      this.allProducts = data;
    });
    this.filteredProducts = this.itemForm.controls['productNumber'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterProduct(value||'')),
    );
  }

  setCustomer(){
    this.customerService.loadCustomer().subscribe((data: Array<Custamer>) => {
      this.customer = data;
    });
    this.filteredCustomer = this.detailsForm.controls['customer'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterCustomer(value||'')),
    );
  }

  setDeliveryNote(){
    let now = new Date();
    let date = new Date(now.getFullYear().toString()+"-"+(now.getMonth()+1).toString());
    this.deliveryNoteService.loadDeliveryNotes().subscribe((data : Array<DeliveryNote>) => {
      if(data){
        this.deliveryNotes = data.filter(deliveryNote => new Date(deliveryNote.date) > date);
        console.log("aktuális honapban: "+this.deliveryNotes);
        this.generateDeliveryNoteNumber();
        }
    })
    }

  private _filterProduct(value: string): Product[] {
    const filterValue = value.toLowerCase();
    return this.allProducts.filter(product => product.number.toLowerCase().includes(filterValue) || product.name.toLowerCase().includes(filterValue));
  }
  private _filterCustomer(value: string) {
    const filterValue = value.toLowerCase();
    return this.customer.filter(customer => customer.companyName.toLowerCase().includes(filterValue));
  }

  generateDeliveryNoteNumber(){
    const now = new Date();
    let i = 1;
    this.deliveryNotes.forEach(_ =>{
      i += 1;
    })
    let number = i.toString();
    while(number.toString().length<4){
      number = "0"+number;
    }
    this.deliveryNoteNumber = now.getFullYear()+"-"+ (now.getMonth()+1)+"-"+number;
  }

  addItem(){
    if(this.itemForm.value.productNumber && this.itemForm.value.amount && this.getProduct(this.itemForm.value.productNumber)){
      this.isItem = true;
      this.itemNumber += 1;
      let item : Item = ({
        number: this.itemNumber.toString(),
        productNumber: this.itemForm.value.productNumber,
        price: this.getProduct( this.itemForm.value.productNumber).price,
        amount: this.itemForm.value.amount
      });
      this.checkStock(item.productNumber, this.itemForm.value.amount);
      this.itemArray.push(item);
      this.calculateSumValue(item,true);
      this.itemForm.reset();
      if(this.itemNumber > 1){
        this.table.renderRows();
      }
    }
  }

  getProduct(productNumber: string): any{
    let product:Product|null = null;
    this.allProducts.forEach(element => {
      if(element.number == productNumber){
        product = element;
      }
    });
    return product;
  }

  checkStock(productNumber: string, amount: string){
    this.getProduct(productNumber).stock = (+this.formatNumber(this.getProduct(productNumber).stock) - +amount).toString();
    if(+this.getProduct(productNumber).stock < 0){
      this.invalidStock.push(productNumber);
    }
  }

  getTax() : number{
    switch(this.detailsForm.value.tax){
      case 'zero': 
        return 0;
      case 'half':
        return 13.5;
    }
    return 27;
  
  }
  getPayable(price: string, amount: string): any{
    let tax = (this.getTax()/100)+1
    return this.formatNumber(((+amount)*(+price)*tax).toString());
  }
  getSumPayable(): any{
    let tax = (this.getTax()/100)+1
    return this.formatNumber((this.sumPrice*tax).toString());
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
    this.calculateSumValue(item, false);
    this.refreshStock(item.productNumber, item.amount);
  }

  calculateSumValue(item: Item, isAdding: boolean){
    if(isAdding){
      this.sumAmount = this.sumAmount + (+item.amount);
      this.sumPrice = this.sumPrice + ((+item.price)*(+item.amount));
    }else{
      this.sumAmount = this.sumAmount - (+item.amount);
      this.sumPrice = this.sumPrice - ((+item.price)*(+item.amount));
    }
  }

  refreshStock(productNumber: string, amount: String){
    this.getProduct(productNumber).stock =(+this.getProduct(productNumber).stock + +amount).toString();
    if(this.invalidStock.includes(productNumber) && this.getProduct(productNumber).stock >=0){
      delete this.invalidStock[this.invalidStock.indexOf(productNumber)];
    }
  }

  formatNumber(number: string): string{
    let num = +number.replace(",",".");
    return ((Math.round(num * 100) / 100).toFixed(2)).toString();
  }

  cancel(){
    window.location.reload();
  }
  save(){
    if(this.detailsForm.value.date && this.detailsForm.value.customer){
      let deliveryNote : DeliveryNote = {
        id: uuidv4(),
        number: this.deliveryNoteNumber,
        date: this.detailsForm.value.date.toString(),
        customerId: this.detailsForm.value.customer,
        products: this.itemArray,
        tax: this.getTax().toString(),
      };
      this.deliveryNoteService.create(deliveryNote).then(_=>{
        //TODO: Products db módosítása
        this.itemArray.forEach(item => {
          let product = this.getProduct(item.productNumber);
          this.productService.setProduct(product);
        });
        this.router.navigate(['home/deliveryNote', deliveryNote.id]);
      }).catch(error=>{
        console.error(error);
      });
    } 
  }

  getCustomerId(){
    let id = "";
    this.customer.forEach(element => {
      if(element.companyName == this.detailsForm.value.customer){
        id = element.id;
      }
    });
    return id;
  }
}
