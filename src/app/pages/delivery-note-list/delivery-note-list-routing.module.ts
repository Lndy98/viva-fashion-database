import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryNoteListComponent } from './delivery-note-list.component';

const routes: Routes = [{ path: '', component: DeliveryNoteListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeliveryNoteListRoutingModule { }
