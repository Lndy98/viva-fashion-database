import { Component, OnInit } from '@angular/core';
import { Custamer } from 'src/app/shared/models/Custamer';
import { CustomersService } from 'src/app/shared/services/customers.service';
import { FormControl, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customers:Array<Custamer> = [];
  displayedColumns: string[] = ['companyName', 'address', 'taxnumber','accountNumber', 'type', 'comment'];

  detailsForm = new FormGroup({
    companyName: new FormControl('')
  });

  constructor(private customerService: CustomersService) { }

  ngOnInit(): void {
  }

  setProduct(){
    this.customerService.loadCustomer().subscribe((data: Array<Custamer>) => {
      console.log(data);
      this.customers = data;
    })
  }

  search(){
    if(this.detailsForm.value.companyName && this.detailsForm.value.companyName.length >= 3){
      let start = this.detailsForm.value.companyName.toUpperCase();
      let end = start.slice(0,start.length-1);
      let lastChar = start.slice(start.length-1);
      let charCode = lastChar.charCodeAt(0);
      if(charCode>89 || charCode == 57){
        this.customerService.getBySearchNameStartWith(start).subscribe((data:Array<Custamer>)=>{
          this.customers = data;
        })
        return;
      } else if (charCode<89){
        charCode +=  1;
        lastChar = String.fromCharCode(charCode);
        
        end += lastChar;
        this.customerService.getBySearchNameBetween(start,end).subscribe((data: Array<Custamer>) => {
          console.log(data);
          this.customers = data;
        })
      }
    }
    }

}
