import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DbLoaderComponent } from './db-loader.component';

const routes: Routes = [{ path: '', component: DbLoaderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DbLoaderRoutingModule { }
