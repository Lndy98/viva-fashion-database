import { Component } from '@angular/core';
import { ProductInterface } from './shared/models/ProductInterface';
import { AuthService } from './shared/services/auth.service';
import { ProductService } from './shared/services/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'viva-fashion-database';
  loggedInUser?: firebase.default.User | null;
  isAdmin :boolean = false;

  constructor (private readonly authService: AuthService){}

  products!: ProductInterface[];

  ngOnInit(){
    this.authService.isUserLoggedIn().subscribe(user=>{
      this.loggedInUser = user;
      localStorage.setItem('user', JSON.stringify(this.loggedInUser));
      if(user?.email == 'admin@gmail.com'){
        this.isAdmin = true;
      }
    }, error => {
      localStorage.setItem('user', JSON.stringify(null));
      console.error(error);
    })
  }

  logout(){
    this.authService.logout().then(()=>{
      this.isAdmin = false;
    }).catch(error=>{
      console.log(error);
    });
   }

}
