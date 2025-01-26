import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CovalentLayoutModule } from '@covalent/core/layout';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,CovalentLayoutModule, MatButtonModule, MatButtonToggleModule, MatIconModule, MatListModule, MatSnackBarModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent implements OnInit {
  title = 'Ghar ka kharcha';

  constructor(public router: Router,
              //public authService: AuthService,
              public snackBar: MatSnackBar) {
  }
  ngOnInit() {
  }
  shouldDisplay(): boolean {
    return (this.router.url === '/home' || this.router.url === '/dashboard');
  }

  logOut() {
    // this.authService.signOut()
    //   .then((data) => {
    //     this.router.navigate(['/login']).then(r => {
    //     });
    //     this.snackBar.open('Logged out!', '', {duration: 2000});
    //   }).catch(e => {
    //   this.snackBar.open(e.message, '', {duration: 2000});
    // })
  }
}
