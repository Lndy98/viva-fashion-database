import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryNoteListRoutingModule } from './delivery-note-list-routing.module';
import { DeliveryNoteListComponent } from './delivery-note-list.component';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    DeliveryNoteListComponent
  ],
  imports: [
    CommonModule,
    DeliveryNoteListRoutingModule,
    MatTableModule,
    MatButtonModule
  ]
})
export class DeliveryNoteListModule { }
