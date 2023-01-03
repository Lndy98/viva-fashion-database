import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryNoteListRoutingModule } from './delivery-note-list-routing.module';
import { DeliveryNoteListComponent } from './delivery-note-list.component';
import {MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatRadioModule} from '@angular/material/radio';


@NgModule({
  declarations: [
    DeliveryNoteListComponent
  ],
  imports: [
    CommonModule,
    DeliveryNoteListRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatRadioModule
  ]
})
export class DeliveryNoteListModule { }
