import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create.component';

const routes: Routes = [{ path: '', component: CreateComponent, 
  children:[
    { path: 'outgoing', loadChildren: () => import('../outgoing/outgoing.module').then(m => m.OutgoingModule) },
    { path: 'incoming', loadChildren: () => import('../incoming/incoming.module').then(m => m.IncomingModule) },
    { path: '', loadChildren: () => import('../outgoing/outgoing.module').then(m => m.OutgoingModule) },
    { path: 'newcustomer', loadChildren: () => import('../new-customer/new-customer.module').then(m => m.NewCustomerModule) },
    { path: 'newproduct', loadChildren: () => import('../new-product/new-product.module').then(m => m.NewProductModule) },
   
  ] },];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateRoutingModule { }
