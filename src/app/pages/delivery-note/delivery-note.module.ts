import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryNoteRoutingModule } from './delivery-note-routing.module';
import { DeliveryNoteComponent } from './delivery-note.component';

import {MatTableModule} from '@angular/material/table';
import {NgxPrintModule} from 'ngx-print';

@NgModule({
  declarations: [
    DeliveryNoteComponent
  ],
  imports: [
    CommonModule,
    DeliveryNoteRoutingModule,
    MatTableModule,
    NgxPrintModule
  ]
})
export class DeliveryNoteModule { }
