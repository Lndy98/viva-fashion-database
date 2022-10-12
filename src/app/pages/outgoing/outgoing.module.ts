import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OutgoingRoutingModule } from './outgoing-routing.module';
import { OutgoingComponent } from './outgoing.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
  declarations: [
    OutgoingComponent
  ],
  imports: [
    CommonModule,
    OutgoingRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
})
export class OutgoingModule { }
