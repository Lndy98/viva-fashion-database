import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DbLoaderRoutingModule } from './db-loader-routing.module';
import { DbLoaderComponent } from './db-loader.component';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    DbLoaderComponent
  ],
  imports: [
    CommonModule,
    DbLoaderRoutingModule,
    MatButtonModule
  ]
})
export class DbLoaderModule { }
