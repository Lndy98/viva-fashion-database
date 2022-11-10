import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/products.service';
import { Product } from '../../shared/models/Product';
import { Unit } from "../../shared/models/Unit";

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  public Unit = Unit;
  products !: Array<Product>;

  productsDisplayedColumns: string[] = ['number', 'name', 'materialComposition', 'stock', 'unit', 'price', 'incomingPrice', 'stockValue'];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.setProduct();
  }

  setProduct(){
    this.productService.loadProduct().subscribe((data: Array<Product>) => {
      console.log(data);
      this.products = data;
    })
  }

}
