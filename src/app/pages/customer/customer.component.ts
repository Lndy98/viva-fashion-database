import { Component, OnInit } from '@angular/core';
import { Custamer } from 'src/app/shared/models/Custamer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customers:Array<Custamer> = [];
  displayedColumns: string[] = ['companyName'];

  constructor() { }

  ngOnInit(): void {
  }

}
