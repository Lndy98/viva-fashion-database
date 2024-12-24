import { Component, OnInit, ViewChild } from '@angular/core';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { FormControl, FormGroup } from '@angular/forms'
import { Product, ProductKeys } from 'src/app/shared/models/Product';
import { ProductService } from 'src/app/shared/services/products.service';
import { Item } from 'src/app/shared/models/Item';
import {MatTable} from '@angular/material/table';
import { ActivatedRoute, Route, Router } from '@angular/router';

import { DeliveryNote, DeliveryNoteKeys } from 'src/app/shared/models/DeliveryNote';
import { DeliveryNotesService } from 'src/app/shared/services/delivery-notes.service';
import { Custamer } from 'src/app/shared/models/Custamer';
import { Util } from 'src/app/shared/interfaces/Util';


import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from '@firebase/firestore';
import { LocalStorageServiceService } from 'src/app/shared/services/local-storage-service.service';
import { FileReaderUtil } from 'src/app/shared/interfaces/FileReader';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.scss'],
  providers: [Util, FileReaderUtil]
})
export class IncomingComponent implements OnInit {
  @ViewChild (MatTable) table !: MatTable<Item>;
  itemNumber: number = 0;
  isItem: boolean = false;

  isNew: boolean = false;

  products !: Array<Product>;
  customers !: Array<Custamer>;
  filteredProducts !: Observable<Product[]>;
  filteredCustomer !: Observable<Custamer[]>;

  items: Item[] = []
  incomingProduct : Array< Product> = [];
  displayedColumns: string[] = ['number', 'amount', 'incomingPrice', 'price', 'delete'];

  detailsForm = new FormGroup({
    customer: new FormControl(''),
    date: new FormControl()
  });

  itemForm =  new FormGroup({
    productNumber: new FormControl(''),
    amount: new FormControl('')
  });

  deliveryNote!: DeliveryNote; 

  fileInput:any;


  constructor(private route: ActivatedRoute,private router: Router, private productService: ProductService, private deliveryNoteService: DeliveryNotesService,
      private localStorageServiceService:LocalStorageServiceService, public util: Util, public fileReader: FileReaderUtil) { }

  ngOnInit(): void {
    if(!this.deliveryNote){
      this.route.params.subscribe(params => {
        if(params['id']){
          this.getDeliveryNote(params['id']);
        } else {
          this.isNew = true;
          this.setDeliveryNote();
        }
      });
    }

    this.setCustomer();
    this.setProduct();
  }

  getDeliveryNote(id: string){
    this.deliveryNoteService.getById(id).subscribe(data =>{
      if(data){
        this.deliveryNote = data;
        this.items = this.deliveryNote.products;
        this.isItem = true;
        this.itemNumber = this.items.length;

        this.items.forEach( item =>{
          this.productService.getByNumber(item.productNumber).subscribe(product =>{
            if(product){
              let pr = product[0];
              pr.stock = (+pr.stock - +item.amount).toString()
              this.incomingProduct.push(pr);
            }
          })
        })
        this.deliveryNote.searchArray = [];
        this.detailsForm.get('customer')?.setValue(this.deliveryNote.customerId);
        this.detailsForm.get('date')?.setValue(this.deliveryNote.date);
      }
    })
  }

  isInArray(productNumber: string): boolean{
    let isIn = false;
    this.products.forEach(product=>{
      if(product.number == productNumber){
        isIn = true;
      }
    })
    return isIn;
  }

  setCustomer() {
    // Az aszinkron adatbetöltést a subscribe-al végezzük el
    this.localStorageServiceService.getCustomers().subscribe(customers => {
      this.customers = customers; 
      this.filteredCustomer = this.detailsForm.controls['customer'].valueChanges.pipe(
        startWith(''),
        map(value => this._filterCustomer(value || '')),
      );
    });
  }
  setProduct(){
    this.localStorageServiceService.getProducts().subscribe(products => {
      this.products = products; 
      this.filteredProducts = this.itemForm.controls['productNumber'].valueChanges.pipe(
        startWith(''),
        map(value => this._filterProduct(value || '')),
      );
    });
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

 setDeliveryNote(){
  let now = new Date();
    let date = new Date(now.getFullYear().toString()+"-"+(now.getMonth()+1).toString());
    
  this.deliveryNoteService.getByMonth(date).subscribe((data : Array<DeliveryNote>) => {
    if(data){
      this.deliveryNote={
        id: uuidv4(),
        number: this.generateDeliveryNoteNumber((data.length+3).toString()),
        customerId: "",
        products: [],
        type: "incoming",
        tax: "",
        date: Timestamp.fromDate(new Date(new Date().toDateString())),
        searchArray: []
      } 
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
    


  addItem(){
    if(this.itemForm.value.productNumber && this.itemForm.value.amount && this.getProduct(this.itemForm.value.productNumber)){
      let pr = this.getProduct(this.itemForm.value.productNumber);
      let amount = this.itemForm.value.amount;
      this.itemNumber += 1;
      this.isItem = true;
      if(this.isInItemArray(this.itemForm.value.productNumber)){
        this.items.forEach(element => {
          console.log(element.number == this.itemForm.value.productNumber)
          if(element.productNumber == this.itemForm.value.productNumber){
            console.log(element);
            element.amount = (+element.amount + +amount).toString();
          }
        });
      } else{
      let item : Item ={
        number: this.itemNumber.toString(),
        productNumber: this.itemForm.value.productNumber,
        productName: pr.name,
        amount: amount,
        price: pr.price,
        incomingPrice: pr.incomingPrice
      }
      this.incomingProduct.push(pr);
      this.items.push(item);
      if(this.itemNumber >1){ this.table.renderRows(); }
      
      }
      this.itemForm.reset();
    }
  }
  isInItemArray(productNumber: string){
    let isInArray = false;
    this.items.forEach(element =>{
      if(element.productNumber == productNumber){
        isInArray = true;
      }
    })
    return isInArray;
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

  getIncomingProducts( itemNumber: string){
    let product:Product = {number: "", id:"", name:"", stock:"", unit:"", price:"", origin:"", materialComposition:"", grammWeight:"", incomingPrice:"", vtsz:""};
    this.incomingProduct.forEach(element => {
      if( element.number == itemNumber){
        product = element;
      }
    });
    return product;
  }

  removeElement(item: Item){
    const indexItem = this.items.indexOf(item);
    if (indexItem !== -1) {
      this.items.splice(indexItem, 1);
    }
    if(this.items){
      this.table.renderRows();
    } else {
      this.isItem = false;
    }
  }


  cancel(){
    if(!this.isNew){
      this.router.navigate(['home/deliveryNote', this.deliveryNote.id]);
    } else{
      window.location.reload();
    }
  }
  async save(){
    if(this.detailsForm.value.date){ 
      this.deliveryNote.date = Timestamp.fromDate(new Date(new Date().toDateString()));
      if(this.detailsForm.value.customer){
        this.deliveryNote.customerId = this.detailsForm.value.customer;
      }
      this.deliveryNote.products = this.items;
      
      let modifyProductsList : Product[] = [];

      this.incomingProduct.forEach(async product =>{
        this.deliveryNote.searchArray.push(product.number);
        await this.util.addItemAmountToStock(product,this.items);
        modifyProductsList.push(product);
      })

      console.log("Végeredményben a készlet és ár: ");
      console.log(modifyProductsList);

      await this.deliveryNoteService.create(this.deliveryNote);
      modifyProductsList.forEach(async product => {
          await this.productService.setProduct(product);
        })
       this.router.navigate(['home/deliveryNote', this.deliveryNote.id]);

    }
  } 


  onFileChange(event: any): void{
    console.log("Hello")
      const file: File = event.target.files[0];
      if (file && file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        const reader = new FileReader();

        reader.onload = (e: any) => {
         const jsonData = this.fileReader.readExcel(e);
         let keys: ProductKeys[] = ['number', 'stock', 'incomingPrice'];
         if(this.fileReader.validateHeader(jsonData[0], keys )){
          console.log("Valid fejléc")
          keys = jsonData[0];
          let output = this.fileReader.transferJsonToObject(jsonData.slice(1), keys);
          console.log(output);
         } else {
          alert("Az excel fejléce nem megfelelő.")
         }
        };

        reader.readAsArrayBuffer(file);
      } else {
        alert('Kérlek válassz egy érvényes Excel fájlt (.xlsx)');
      }
    }
  }
