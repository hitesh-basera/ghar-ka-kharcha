import { Component,Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSnackBar,MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../shared/interfaces/user-model';
import { DOCUMENT } from '@angular/common'; 
import { UsernameValidatorDirective } from '../shared/directives/username-validator.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,MatCardModule,ReactiveFormsModule, MatButtonModule,MatFormFieldModule, MatInputModule, 
    MatProgressBarModule, MatSnackBarModule, UsernameValidatorDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  animations: [
    trigger('visibilityChanged', [
      state('true', style({opacity: 1, transform: 'scale(1.0)'})),
      state('false', style({opacity: 0, transform: 'scale(0.0)'})),
      transition('1 => 0', animate('300ms')),
      transition('0 => 1', animate('900ms'))
    ])
  ]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  currentUser: User = {userName: '', password: ''};
  isLoading = false;
  isVisible = true;
  constructor(private router: Router,
              //private authService: AuthService,
              private snackBar: MatSnackBar,
              //private loginService: LoginService,
              @Inject(DOCUMENT) private document: Document,
              private fb: FormBuilder
            ) {
              this.loginForm = this.fb.group({
                userName: ['', [Validators.required,]],
                password:['',[Validators.required,this.passwordValidator]]
              });
            }

  ngOnInit() {
    setTimeout(() => this.scrollTop());
  }
  passwordValidator(control: FormControl): { [key: string]: any } | null {
    const hasNumber = /\d/.test(control.value);
    const hasUppercase = /[A-Z]/.test(control.value);
    const hasLowercase = /[a-z]/.test(control.value);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~-]/.test(control.value);

    if (hasNumber && hasUppercase && hasLowercase && hasSpecialChar) {
      return null; // Valid password
    }

    return { 'invalidPassword': true }; // Invalid password
  }

  signUp() {
    this.router.navigate(['/signUp']).then();
  }
  login() {
    this.startLoading();
    // this.authService.logIn(this.currentUser.email, this.currentUser.password).then((data) => {
    //   this.loginService.setUser(data.user);
    //   this.stopLoading();
    //   this.snackBar.open('Login Successful!', '', {duration: 2000});
    //   this.onSuccessfulLogIn()

    // }).catch(e => {
    //   this.stopLoading();
    //   console.log('Catches object set:' + e.message);
    //   this.snackBar.open(e.message, 'ok', {duration: 4000});
    // })
  }

  onSuccessfulLogIn() {
    this.router.navigate(['/dashboard']).then();
  }

  startLoading() {
    this.isLoading = true;
  }

  stopLoading() {
    this.isLoading = false;
  }

  toggleLogin() {
    this.isVisible = true;
    setTimeout(() => this.scrollToLogin());
  }

  scrollToLogin() {
    const element = document.getElementById('target');
    element?.scrollIntoView();
  }

  checkLogin(value: any, valid: any, form: any) {
    if (valid) {
      this.login();
    }
  }

  scrollTop() {
    //const element = this.document.getElementById('content');
    // if(this.contentElement){
    //   this.contentElement.nativeElement.scrollIntoView(); 
    // }
    // else{
    //   console.error('Element with ID "content" not found.');
    // }
    
  }
}
