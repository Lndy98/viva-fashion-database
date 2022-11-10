import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( public myAuth: AngularFireAuth, public router: Router,) { }


  login( email: string,pwd: string){
    return this.myAuth.signInWithEmailAndPassword(email, pwd);
  }

  logout(){
    return this.myAuth.signOut();
  }

  isUserLoggedIn(){
    return this.myAuth.user;
  }
}
