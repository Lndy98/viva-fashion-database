import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms'
import {Router} from '@angular/router';
import {ProductInterface} from 'src/app/shared/models/ProductInterface';
import {LocalStorageServiceService} from 'src/app/shared/services/local-storage-service.service';
import {ProductService} from 'src/app/shared/services/products.service';
import {v4 as uuidv4} from 'uuid';
import {ProductFactory} from "../../shared/factories/ProductFactory";

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.scss']
})
export class NewProductComponent implements OnInit {

  product!: ProductInterface;

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

  text: string = ""

  constructor( private readonly productService: ProductService, private readonly localStorage: LocalStorageServiceService) {
  }

  ngOnInit(): void {
  }

  async save() {
    this.text = "";
    let isSuccess = false;
    await this.createProduct();
    //TODO:refact and test
    if (this.text == "") {
      console.log(this.product);
      this.productService.getByNumber(this.product.number).subscribe(async data => {
        console.log(data);
        if (data.length == 0) {
          console.log("isSuccess");
          isSuccess = true;
          await this.productService.create(this.product);
          this.localStorage.updateProduct(this.product);
          window.location.reload();
        } else if (data.length != 0 && !isSuccess) {
          this.text = "A megadott cikkszám már létezik!";
        }
      })
    }
  }

  createProduct() {
    if (this.detailsForm.value.name && this.detailsForm.value.number && this.detailsForm.value.stock
      && this.detailsForm.value.unit && this.detailsForm.value.price && this.detailsForm.value.incomingPrice) {
      this.product = ProductFactory.createProduct(this.detailsForm.value.number, this.detailsForm.value.name, this.detailsForm.value.stock, this.detailsForm.value.unit,
        this.detailsForm.value.price, this.detailsForm.value.incomingPrice, this.detailsForm.value.materialComposition, this.detailsForm.value.grammWeight,
        this.detailsForm.value.vtsz, this.detailsForm.value.origin);
    } else {
      this.text = "Minden csillaggal jelölt mezőt töltsön ki!"
    }
    return Promise.resolve('done');
  }

  cancel() {
    window.location.reload();
  }
}
