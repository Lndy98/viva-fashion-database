import { Component, OnInit } from '@angular/core';
import { Custamer } from 'src/app/shared/models/Custamer';
import { Product } from 'src/app/shared/models/Product';
import { CustomersService } from 'src/app/shared/services/customers.service';
import { ProductService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-db-loader',
  templateUrl: './db-loader.component.html',
  styleUrls: ['./db-loader.component.scss']
})
export class DbLoaderComponent implements OnInit {

  products: Product[] = [];
  productsLength: number = this.products.length;
  custamers: Custamer[] = [];
  custamersLength: number = this.custamers.length;

  constructor( private productService: ProductService, private customerService: CustomersService) { }

  ngOnInit(): void {
  }

  getProduct(){

  }

  loadProducts(){
    console.log("Loading has started!")
    this.products.forEach((product, index) =>{
      this.productService.create(product).then(_=>{
        this.productsLength -= 1;
        console.log(this.productsLength);
      })
    });
  }
  loadCustomer(){
    console.log("Loading has started!")
    this.custamers.forEach((custamer, index) =>{
      this.customerService.create(custamer).then(_=>{
        this.custamersLength -= 1;
        console.log(this.custamersLength);
      })
    });
  }

  loadCustamers(){}

}
