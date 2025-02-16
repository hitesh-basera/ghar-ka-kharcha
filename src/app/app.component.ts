import { Component, EventEmitter, Output } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from "./core/app-header/app-header/app-header.component";
import { FooterComponent } from './core/app-footer/footer/footer.component';
import {CovalentLayoutModule} from '@covalent/core/layout'
import { Account } from './shared/interfaces/account.model';
import { Router } from '@angular/router';
import { FinanceDbService } from './services/finance-db.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CovalentLayoutModule, AppHeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Ghar ka kharcha';
  accounts: Account[] = [];
  selectedAccount: Account | null = null;
  //@Output() accountSelected = new EventEmitter<Account>();
/**
 *
 */
constructor(private router: Router, private financeDbService: FinanceDbService) {
  
  
}
ngOnInit() {
  this.loadAccounts();
}
async loadAccounts() {
  const loadAccounts= await this.financeDbService.getAccounts();
  this.accounts = [...loadAccounts];
}
  onAccountSelected(account: Account) {
    this.selectedAccount = account;
    this.router.navigate(['/account', account.id]); // Navigate with the account ID
}
}
