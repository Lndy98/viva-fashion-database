import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OutgoingComponent } from './outgoing.component';

const routes: Routes = [{ path: '', component: OutgoingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutgoingRoutingModule { }
