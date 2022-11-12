import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.scss']
})
export class NewCustomerComponent implements OnInit {

  detailsForm = new FormGroup({
    name: new FormControl(''),
    country: new FormControl(''),
    ZIPcode: new FormControl(''),
    town: new FormControl(''),
    street: new FormControl(''),
    taxNumber: new FormControl(''),
    accountNumber: new FormControl(),
    type: new FormControl(),
    comment: new FormControl()
  });

  constructor() { }

  ngOnInit(): void {
  }

  save(){}

  createProduct(){
    
  }

  cancel(){window.location.reload();}

}
