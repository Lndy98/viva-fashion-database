import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/products.service';
import { Product } from '../../shared/models/Product';
import { Unit } from "../../shared/models/Unit";
import { FormControl, FormGroup } from '@angular/forms'
import { Util } from 'src/app/shared/interfaces/Util';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  providers: [Util]
})
export class ProductsComponent implements OnInit {
 
  detailsForm = new FormGroup({
    prductNumber: new FormControl('')
  });

  public Unit = Unit;
  products !: Array<Product>;

  productsDisplayedColumns: string[] = ['number', 'name', 'materialComposition', 'stock', 'price', 'incomingPrice', 'stockValue', 'save'];

  constructor(private productService: ProductService, private util: Util) { }

  ngOnInit(): void {
  }

  search(){
    if(this.detailsForm.value.prductNumber){
      let start = this.detailsForm.value.prductNumber.toUpperCase();
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
  }
  save(element: Product){
    if(element.price && element.incomingPrice){
      this.productService.setProduct(element);
    }
  }
}
