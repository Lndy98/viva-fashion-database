import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IncomingComponent } from './incoming.component';

const routes: Routes = [{ path: '', component: IncomingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IncomingRoutingModule { }
