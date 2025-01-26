import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CovalentLayoutModule } from '@covalent/core/layout';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, CovalentLayoutModule, RouterModule, MatButtonModule, MatIconModule,MatButtonToggleModule, MatListModule,
    MatSnackBarModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

constructor(public router: Router) {

}
ngOnInit() {
}
isLoggedIn(): boolean {
  return false;
  //return (this.router.url === '/home' || this.router.url === '/dashboard');
}
navigateToCorrectLink(link: string) {
  let url = '';
  switch (link) {
    case 'linkedin':
      url = 'https://www.linkedin.com/in/hitesh-singh-basera-38300820/';
      break;

    case 'github':
      url = 'https://github.com/hitesh-basera';
      break;

    case 'sourceCode':
      url = 'https://github.com/hitesh-basera/restaurant-react';
      break;

    default:
      url = 'https://www.linkedin.com/in/hitesh-singh-basera-38300820/';
  }

  window.open(url);
}
}
