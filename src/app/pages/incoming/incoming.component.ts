import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.component.html',
  styleUrls: ['./incoming.component.scss']
})
export class IncomingComponent implements OnInit {
  itemNumber: number = 1;

  constructor() { }

  ngOnInit(): void {
  }

  addItem(){
    this.itemNumber += 1;
  }

}
