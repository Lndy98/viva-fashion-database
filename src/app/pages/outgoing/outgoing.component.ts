import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-outgoing',
  templateUrl: './outgoing.component.html',
  styleUrls: ['./outgoing.component.scss']
})
export class OutgoingComponent implements OnInit {
  itemNumber: number = 1;

  constructor() { }

  ngOnInit(): void {
  }
  
  addItem(){
    this.itemNumber += 1;
  }

}
