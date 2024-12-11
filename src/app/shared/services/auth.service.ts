import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import {map, Observable} from 'rxjs';
import { User } from '../models/User';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( public myAuth: AngularFireAuth, public router: Router, private afs: AngularFirestore) { }
  userCollectionName='Users';

    
  login( email: string,pwd: string){
    return this.myAuth.signInWithEmailAndPassword(email, pwd);
  }

  logout(){
    return this.myAuth.signOut();
  }

  isUserLoggedIn(){
    return this.myAuth.user;
  }
  getCurrentUser(): Observable<any> {
    return this.myAuth.authState;
  }

  getUserByUsername(userName: string){
    return this.afs.collection<User>(this.userCollectionName, o => o.where('username', '==', userName)).
    valueChanges()
    .pipe(
        map((users: User[]) => users[0]) // Ha egyetlen felhasználót keresünk, az első elemet választjuk ki
      );
  }
}
