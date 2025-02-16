import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Account } from '../shared/interfaces/account.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private selectedAccountSource = new BehaviorSubject<Account | undefined>(undefined); // Start with null or a default account
  selectedAccount$ = this.selectedAccountSource.asObservable();
  constructor() { }
  setSelectedAccount(accountName: Account | undefined) {
    this.selectedAccountSource.next(accountName);
  }
  getSelectedAccount(): Account | undefined { // Optional, but can be helpful for getting current value synchronously
    return this.selectedAccountSource.value;
  }
}
