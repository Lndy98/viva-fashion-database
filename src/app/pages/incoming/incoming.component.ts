import { Component, OnInit, ViewChild } from '@angular/core';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

import { FormControl, FormGroup } from '@angular/forms'
import { Product } from 'src/app/shared/models/Product';
import { ProductService } from 'src/app/shared/services/products.service';
import { Item } from 'src/app/shared/models/Item';
import {MatTable} from '@angular/material/table';

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


  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.setProduct();
  }

  setProduct(){
    this.productService.loadProduct().subscribe((data: Array<Product>) => {
      if(data){
        this.allProducts = data;
        this.filteredProducts = this.itemForm.controls['productNumber'].valueChanges.pipe(
          startWith(''),
          map(value => this._filterProduct(value||'')),
        );
      }
    });
  }

  private _filterProduct(value: string): Product[] {
    const filterValue = value.toLowerCase();
    return this.allProducts.filter(product => product.number.toLowerCase().includes(filterValue) || product.name.toLowerCase().includes(filterValue));
  }

  addItem(){
    if(this.itemForm.value.productNumber && this.itemForm.value.amount && this.getProduct(this.itemForm.value.productNumber)){
      this.itemNumber += 1;
      this.isItem = true;
      let item : Item ={
        number: this.itemNumber.toString(),
        productNumber: this.itemForm.value.productNumber,
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
    let unSuccesArray: Product[] = [];
    this.incomingProduct.forEach((element:Product, key:string) => {
      this.productService.setProduct(element).then(_=>{
      }).catch(error=>{
        console.error(error);
      });
    });
    window.location.reload();
  }
  calculateStock(){
    this.items.forEach(element =>{
      let product = this.getIncomingProducts(element.number);
      product.stock = (+product.stock + +element.amount).toString();
      this.incomingProduct.set(element.number, product);
    })
  }

  

}
