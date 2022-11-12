import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/shared/services/products.service';
import { Product } from '../../shared/models/Product';
import { Unit } from "../../shared/models/Unit";
import { FormControl, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  public Unit = Unit;
  products !: Array<Product>;


  detailsForm = new FormGroup({
    prductNumber: new FormControl('')
  });

  productsDisplayedColumns: string[] = ['number', 'name', 'materialComposition', 'stock', 'unit', 'price', 'incomingPrice', 'stockValue'];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
  }

  search(){
    if(this.detailsForm.value.prductNumber && this.detailsForm.value.prductNumber.length >= 3){
      let start = this.detailsForm.value.prductNumber.toUpperCase();
      let end = start.slice(0,start.length-1);
      let lastChar = start.slice(start.length-1);
      let charCode = lastChar.charCodeAt(0);
      if(charCode>89 || charCode == 57){
        this.productService.getByNumberStartWith(start).subscribe((data:Array<Product>)=>{
          this.products = data;
        })
        return;
      } else if (charCode<89){
        charCode +=  1;
        lastChar = String.fromCharCode(charCode);
        
        end += lastChar;
        this.productService.getByNumberBetween(start,end).subscribe((data: Array<Product>) => {
          console.log(data);
          this.products = data;
        })
      }
    }
    }
  }

