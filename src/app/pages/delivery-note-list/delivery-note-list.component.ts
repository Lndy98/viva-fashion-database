import { Component, OnInit } from '@angular/core';
import { DeliveryNote } from 'src/app/shared/models/DeliveryNote';

@Component({
  selector: 'app-delivery-note-list',
  templateUrl: './delivery-note-list.component.html',
  styleUrls: ['./delivery-note-list.component.scss']
})
export class DeliveryNoteListComponent implements OnInit {
  deliveryNotes:Array<DeliveryNote> = [];
  displayedColumns: string[] = ['number', 'date', 'custamer'];

  constructor() { }

  ngOnInit(): void {
  }

}
