import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewCustomerRoutingModule } from './new-customer-routing.module';
import { NewCustomerComponent } from './new-customer.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    NewCustomerComponent
  ],
  imports: [
    CommonModule,
    NewCustomerRoutingModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule
  ]
})
export class NewCustomerModule { }
