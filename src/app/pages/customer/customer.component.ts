import { Component, OnInit } from '@angular/core';
import { Custamer } from 'src/app/shared/models/Custamer';
import { CustomersService } from 'src/app/shared/services/customers.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customers:Array<Custamer> = [];
  displayedColumns: string[] = ['companyName', 'address', 'taxnumber','accountNumber', 'type', 'comment'];

  constructor(private customerService: CustomersService) { }

  ngOnInit(): void {
    this.setProduct();
  }

  setProduct(){
    this.customerService.loadCustomer().subscribe((data: Array<Custamer>) => {
      console.log(data);
      this.customers = data;
    })
  }

}
