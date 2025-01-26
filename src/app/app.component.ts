import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from "./core/app-header/app-header/app-header.component";
import { FooterComponent } from './core/app-footer/footer/footer.component';
import {CovalentLayoutModule} from '@covalent/core/layout'
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CovalentLayoutModule, AppHeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Ghar ka kharcha';
}
