import { Component, OnInit, ViewChild } from '@angular/core';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { FormControl, FormGroup } from '@angular/forms'
import { Product } from 'src/app/shared/models/Product';
import { ProductService } from 'src/app/shared/services/products.service';
import { Item } from 'src/app/shared/models/Item';
import {MatTable} from '@angular/material/table';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.scss']
})
export class IncomingComponent implements OnInit {
  @ViewChild (MatTable) table !: MatTable<Item>;
  itemNumber: number = 0;
  isItem: boolean = false;

  allProducts !: Array<Product>;
  filteredProducts !: Observable<Product[]>;

  items: Item[] = []
  incomingProduct : Map<string, Product> = new Map;
  displayedColumns: string[] = ['number', 'amount', 'incomingPrice', 'price', 'delete'];

  itemForm =  new FormGroup({
    productNumber: new FormControl(''),
    amount: new FormControl(''),
    incomingPrice: new FormControl(''),
    price: new FormControl(''),
  });


  constructor(private router: Router, private productService: ProductService) { }

  ngOnInit(): void {
    this.setProduct();
  }

  setProduct(){
    this.filteredProducts = this.itemForm.controls['productNumber'].valueChanges.pipe(
      startWith(''),
      map(value => this._filterProduct(value||'')),
    );
  }

  private _filterProduct(value: string): Product[] {
    if(value.length == 2|| value.length >2 && !this.allProducts){
      this.searchProduct(value);
    }
    if(value.length >=3 && this.allProducts){
      const filterValue = value.toLowerCase();
      return this.allProducts.filter(product => product.number.toLowerCase().includes(filterValue) );
    }
    return [];
  }

  addItem(){
    if(this.itemForm.value.productNumber && this.itemForm.value.amount && this.getProduct(this.itemForm.value.productNumber)){
      this.itemNumber += 1;
      this.isItem = true;
      let item : Item ={
        number: this.itemNumber.toString(),
        productNumber: this.itemForm.value.productNumber,
        productName: "",
        amount: this.itemForm.value.amount.toString(),
        price: ""
      }
      this.addProduct(this.itemForm.value.productNumber);
      this.items.push(item);
      if(this.itemNumber >1){ this.table.renderRows(); }
      this.itemForm.reset();
    }
  }

  addProduct(productNumber: string){
    let pr = this.getProduct(productNumber);
    if(this.itemForm.value.incomingPrice){
      pr.incomingPrice = this.itemForm.value.incomingPrice;
    }
    if(this.itemForm.value.price){
      pr.price = this.itemForm.value.price;
    }
    this.incomingProduct.set(this.itemNumber.toString(),pr);
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

  getIncomingProducts( itemNumber: string){
    let product:Product = {number: "", id:"", name:"", stock:"", unit:"", price:"", origin:"", materialComposition:"", grammWeight:"", incomingPrice:"", vtsz:""};
    this.incomingProduct.forEach((element:Product, key:string) => {
      if( key == itemNumber){
        product = element;
      }
    });
    return product;
  }

  removeElement(item: Item){
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
    if(this.items){
      this.table.renderRows();
    } else {
      this.isItem = false;
    }
    this.incomingProduct.delete(item.number)
  }

  cancel(){
    window.location.reload();
  }
  save(){
    this.calculateStock();
    this.incomingProduct.forEach((element:Product, key:string) => {
      this.productService.setProduct(element).then(_=>{
        console.log(element);
      }).catch(error=>{
        console.error(error);
      });
    });
    this.router.navigate(['create/incoming']);
  }
  calculateStock(){
    this.items.forEach(element =>{
      let product = this.getIncomingProducts(element.number);
      product.stock = (+product.stock + +element.amount).toString();
      this.incomingProduct.set(element.number, product);
      console.log(this.incomingProduct);
    })
  }

  searchProduct(start: string){
      start = start.toUpperCase();
      let end = start.slice(0,start.length-1);
      let lastChar = start.slice(start.length-1);
      let charCode = lastChar.charCodeAt(0);
      if(charCode>89 || charCode == 57){
        this.productService.getByNumberStartWith(start).subscribe((data:Array<Product>)=>{
          this.allProducts = data;
        })
        return;
      } else if (charCode<89){
        charCode +=  1;
        lastChar = String.fromCharCode(charCode);
        
        end += lastChar;
        this.productService.getByNumberBetween(start,end).subscribe((data: Array<Product>) => {
          console.log(data);
          this.allProducts = data;
        })
      }
    }
  

}
