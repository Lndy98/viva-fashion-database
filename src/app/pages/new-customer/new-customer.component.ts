import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'
import { Router } from '@angular/router';
import { Custamer } from 'src/app/shared/models/Custamer';
import { CustomersService } from 'src/app/shared/services/customers.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-new-customer',
  templateUrl: './new-customer.component.html',
  styleUrls: ['./new-customer.component.scss']
})
export class NewCustomerComponent implements OnInit {

  customer !: Custamer;

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

  constructor(private router: Router, private customerService: CustomersService) { }

  ngOnInit(): void {
  }

  save(){
    this.createCustomer();
    this.customerService.getByName(this.customer.companyName).subscribe(data =>{
      if(data.length > 0){}else{
        this.customerService.create(this.customer);
        this.router.navigate(['create/newcustomer']);
      }
    })
  }

  createCustomer(){
    if(this.detailsForm.value.name){
      this.customer= {
        id: uuidv4(),
        companyName: this.detailsForm.value.name,
        searchName: this.detailsForm.value.name.toUpperCase(),
        country: "",
        ZIPcode: "",
        town: "",
        street: "",
        taxNumber:"",
        accountNumber: "",
        type: "",
        comment: ""
      }
      if(this.detailsForm.value.country){
        this.customer.country = this.detailsForm.value.country;
      }
      
      if(this.detailsForm.value.ZIPcode){
        this.customer.ZIPcode = this.detailsForm.value.ZIPcode;
      }
      
      if(this.detailsForm.value.town){
        this. customer.town = this.detailsForm.value.town;
      }
      
      if(this.detailsForm.value.street){
        this.customer.street = this.detailsForm.value.street;
      }
      if(this.detailsForm.value.taxNumber){
        this.customer.taxNumber = this.detailsForm.value.taxNumber;
      }
      
      if(this.detailsForm.value.accountNumber){
        this.customer.accountNumber = this.detailsForm.value.accountNumber;
      }
      
      if(this.detailsForm.value.type){
        this.customer.type = this.detailsForm.value.type;
      }
      
      if(this.detailsForm.value.comment){
        this.customer.comment = this.detailsForm.value.comment;
      }

    }
    
  }

  cancel(){window.location.reload();}

}
