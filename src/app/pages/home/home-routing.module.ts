import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  { path: '', component: HomeComponent,
  children: [
    { path: 'customer', loadChildren: () => import('../customer/customer.module').then(m => m.CustomerModule) },
    { path: 'products', loadChildren: () => import('../products/products.module').then(m => m.ProductsModule) },
    { path: 'deliveryNoteList', loadChildren: () => import('../delivery-note-list/delivery-note-list.module').then(m => m.DeliveryNoteListModule) },
    { path: '', loadChildren: () => import('../delivery-note-list/delivery-note-list.module').then(m => m.DeliveryNoteListModule) },
    // { ...any other child routes }
  ] },
  { path: 'deliveryNote', loadChildren: () => import('../delivery-note/delivery-note.module').then(m => m.DeliveryNoteModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
