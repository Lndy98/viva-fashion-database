import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'
import { Router } from '@angular/router';
import { User } from 'src/app/shared/models/User';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ProductService } from 'src/app/shared/services/products.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signInForm = new FormGroup({
    username : new FormControl(''),
    password : new FormControl(''),
  });
  

  constructor(private rout: Router,private authService: AuthService, private productService: ProductService) { }

  ngOnInit(): void {
  }

  login() {
    if(this.signInForm.value.password && this.signInForm.value.username){
      let password = this.signInForm.value.password;
      this.authService.getUserByUsername(this.signInForm.value.username).subscribe(user=>{
        if(user)
          {
            this.authService.login(user.email,password ).then(cred=>{
              console.log(cred);
              this.rout.navigateByUrl('/home');
          }).catch(error=>{
            console.log(error);
          });
          }
      })      
    } else {
      console.log("Hiányos login adatok!")
    }
    
  }

}

