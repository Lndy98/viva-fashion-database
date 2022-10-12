import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signUpForm = new UntypedFormGroup({
    username : new UntypedFormControl(''),
    password : new UntypedFormControl(''),
  });
  

  constructor() { }

  ngOnInit(): void {
  }

  login() {
    //TODO
  }

}

