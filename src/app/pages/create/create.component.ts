import { Component, OnInit,  Output, EventEmitter } from '@angular/core';
import { Product } from 'src/app/shared/models/Product';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
