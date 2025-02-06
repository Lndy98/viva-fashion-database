import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/products.service';
import { ProductInterface } from '../../shared/models/ProductInterface';
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
    productNumber: new FormControl('')
  });

  public Unit = Unit;
  products !: Array<ProductInterface>;

  productsDisplayedColumns: string[] = ['number', 'name', 'materialComposition', 'stock', 'price', 'incomingPrice', 'stockValue', 'save'];

  constructor(private productService: ProductService, private util: Util) { }

  ngOnInit(): void {
  }

  search(){
    if(this.detailsForm.value.productNumber){
      let start = this.detailsForm.value.productNumber.toUpperCase();
      let end = this.util.endPartOfSearch(start);
        if(end == ''){
          this.productService.getByNumberStartWith(start).subscribe((data:Array<ProductInterface>)=>{
            this.products = data;
          })
        } else {
          this.productService.getByNumberBetween(start,end).subscribe((data: Array<ProductInterface>) => {
            this.products = data;
          })
         }
    }
  }
  save(element: ProductInterface){
    if(element.price && element.incomingPrice){
      this.productService.setProduct(element);
    }
  }
}
