import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncomingRoutingModule } from './incoming-routing.module';
import { IncomingComponent } from './incoming.component';

import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    IncomingComponent
  ],
  imports: [
    CommonModule,
    IncomingRoutingModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTableModule,
    MatButtonModule
  ]
})
export class IncomingModule { }
