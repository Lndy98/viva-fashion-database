import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
{ path: '', component:LoginComponent,},
{ path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)},
{ path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
{ path: 'create', loadChildren: () => import('./pages/create/create.module').then(m => m.CreateModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
