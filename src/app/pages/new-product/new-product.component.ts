import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'
import { Router } from '@angular/router';
import { Product } from 'src/app/shared/models/Product';
import { ProductService } from 'src/app/shared/services/products.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {

  product!: Product;

  detailsForm = new FormGroup({
    name: new FormControl(''),
    number: new FormControl(''),
    stock: new FormControl(''),
    unit: new FormControl(''),
    price: new FormControl(''),
    materialComposition: new FormControl(''),
    grammWeight: new FormControl(),
    origin: new FormControl(),
    vtsz: new FormControl(),
    incomingPrice: new FormControl()
  });

  text : string = ""

  constructor(private router: Router,private productService: ProductService) { }

  ngOnInit(): void {
  }

  save(){
    this.createProduct();
    this.productService.getByNumber(this.product.number).subscribe(data => {
      console.log(data);
      if(data.length != 0){
      } else {
        this.productService.create(this.product);
        this.detailsForm.reset();
      }
    })
  }

  createProduct(){
    if(this.detailsForm.value.name && this.detailsForm.value.number && this.detailsForm.value.stock
      && this.detailsForm.value.unit && this.detailsForm.value.price && this.detailsForm.value.incomingPrice){
        this.product={
          id: uuidv4(),
          number: this.detailsForm.value.number,
          name: this.detailsForm.value.name,
          stock: this.detailsForm.value.stock,
          unit: this.detailsForm.value.unit,
          price: this.detailsForm.value.price,
          incomingPrice: this.detailsForm.value.incomingPrice,
          materialComposition: "",
          grammWeight: "",
          vtsz: "",
          origin:""
        }
        if(this.detailsForm.value.materialComposition){
          this.product.materialComposition = this.detailsForm.value.materialComposition;
        }
        if(this.detailsForm.value.grammWeight){
          this.product.grammWeight = this.detailsForm.value.grammWeight;
        }
        if(this.detailsForm.value.vtsz){
          this.product.vtsz = this.detailsForm.value.vtsz;
        }
        if(this.detailsForm.value.origin){
          this.product.origin = this.detailsForm.value.origin;
        }
      }
  }

  cancel(){
    window.location.reload();
  }
  isProduct(productNumber: string):boolean{
    let isProduct = false;
   
    return isProduct;
  }
}
