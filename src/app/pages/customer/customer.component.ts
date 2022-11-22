import { Component, OnInit } from '@angular/core';
import { Custamer } from 'src/app/shared/models/Custamer';
import { CustomersService } from 'src/app/shared/services/customers.service';
import { FormControl, FormGroup } from '@angular/forms'
import { Util } from 'src/app/shared/interfaces/Util';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
  providers: [Util]
})
export class CustomerComponent implements OnInit {
  customers!:Array<Custamer>;
  displayedColumns: string[] = ['companyName', 'address', 'taxnumber','accountNumber', 'type', 'comment'];

  detailsForm = new FormGroup({
    companyName: new FormControl('')
  });

  constructor(private customerService: CustomersService, private util: Util) { }

  ngOnInit(): void {
  }

  search(){
    if(this.detailsForm.value.companyName){
      let start = this.detailsForm.value.companyName.toUpperCase();
      let end = this.util.endPartOfSearch(this.detailsForm.value.companyName);
      if(end == ''){
        this.customerService.getBySearchNameStartWith(start).subscribe((data:Array<Custamer>)=>{
          this.customers =  data;
          }) 
    } else {
        let end = this.util.endPartOfSearch(start);
        this.customerService.getBySearchNameBetween(start,end).subscribe((data: Array<Custamer>) => {
            this.customers =  data;
        })
     }
    }
  }
}
