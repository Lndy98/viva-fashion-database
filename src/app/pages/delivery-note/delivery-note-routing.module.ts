import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryNoteComponent } from './delivery-note.component';

const routes: Routes = [{ path: '', component: DeliveryNoteComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryNoteRoutingModule { }
