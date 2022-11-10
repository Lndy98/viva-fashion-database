import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms'
import { Route, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

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
  

  constructor(private rout: Router,private authService: AuthService) { }

  ngOnInit(): void {
  }

  login() {
    if(this.signInForm.value.password && this.signInForm.value.username){
      let email = this.signInForm.value.username + "@gmail.com";

      this.authService.login(email, this.signInForm.value.password).then(cred=>{
        console.log(cred);
        this.rout.navigateByUrl('/home');
    }).catch(error=>{
      console.log(error);
    });
    } else {
      console.log("nem töltötted ki!")
    }
    //TODO
  }

}

