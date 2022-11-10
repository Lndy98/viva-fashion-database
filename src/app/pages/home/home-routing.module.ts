import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from 'src/app/shared/services/admin.guard';
import { HomeComponent } from './home.component';

const routes: Routes = [
  { path: '', component: HomeComponent,
  children: [
    { path: 'customer', loadChildren: () => import('../customer/customer.module').then(m => m.CustomerModule)},
    { path: 'products', loadChildren: () => import('../products/products.module').then(m => m.ProductsModule) },
    { path: 'deliveryNoteList', loadChildren: () => import('../delivery-note-list/delivery-note-list.module').then(m => m.DeliveryNoteListModule) },
    { path: '', loadChildren: () => import('../delivery-note-list/delivery-note-list.module').then(m => m.DeliveryNoteListModule) },
    { path: 'deliveryNote/:id', loadChildren: () => import('../delivery-note/delivery-note.module').then(m => m.DeliveryNoteModule) },
    // { ...any other child routes }
  ] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
