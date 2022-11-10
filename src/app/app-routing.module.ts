import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AdminGuard } from './shared/services/admin.guard';
import { AuthGuard } from './shared/services/auth.guard';

const routes: Routes = [
{ path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule), canActivate: [AuthGuard]},
{ path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) },
{ path: 'create', loadChildren: () => import('./pages/create/create.module').then(m => m.CreateModule), canActivate: [AuthGuard] },
{ path: '', component:LoginComponent},
{ path: 'dbLoader', loadChildren: () => import('./pages/db-loader/db-loader.module').then(m => m.DbLoaderModule), canActivate: [AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
