import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Account } from '../shared/interfaces/account.model';
import { FinanceDbService } from './finance-db.service';
import { Transaction } from '../shared/interfaces/transaction.model';
import { Category } from '../shared/interfaces/category.model';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountsSubject = new BehaviorSubject<Account[]>([]);
  accounts$: Observable<Account[]> = this.accountsSubject.asObservable();
  private selectedAccountSource = new BehaviorSubject<Account | undefined>(undefined); // Start with null or a default account
  selectedAccount$ = this.selectedAccountSource.asObservable();
  constructor(private db: FinanceDbService,private categoryService: CategoryService) { 
    this.loadAccounts();
  }
  // Load services from IndexedDB and emit them through the BehaviorSubject
  private async loadAccounts(): Promise<void> {
    const accountList = await this.db.getAccounts();
    this.accountsSubject.next(accountList);
  }
  setSelectedAccount(accountName: Account | undefined) {
    this.selectedAccountSource.next(accountName);
  }
  getSelectedAccount(): Account | undefined { // Optional, but can be helpful for getting current value synchronously
    return this.selectedAccountSource.value;
  }
  async updateAccountBalance(suggestedTransactions: Transaction[]){
      try{
        const accountId = await suggestedTransactions[0].accountId;//all transactions are part of same account
        let categories:Category[]=[];
        await this.categoryService.categories$.subscribe((data)=>{
          categories= data;
        });
        let balanceChange = 0;
        if(suggestedTransactions && categories){
          suggestedTransactions.forEach((transaction)=>{
            const category = categories.find((cat)=>cat.id===transaction.categoryId)
            if(category){
              if(category.type==='income')
              {
                balanceChange += transaction.amount;
              }
              else if(category.type ==='expense')
              {
                balanceChange -= transaction.amount;
              }
              else if(category.type==='investment')
              {
                balanceChange += transaction.amount;
              }
            }
            else {
              console.warn(`Category with ID ${transaction.categoryId} not found.`);
            }
          });
          // 4. Get the current balance for the account from IndexedDB
          const account = await this.db.getAccountById(accountId);
          if (account) {
            const newBalance = (account.balance || 0) + balanceChange;
            account.balance=newBalance;
            await this.db.updateAccount(account);
            console.log(`Account ${accountId} balance updated to: ${newBalance}`);
            this.selectedAccountSource.next(account)
          } else {
            console.warn(`Account with ID ${accountId} not found.`);
          }
        }
      }
      catch (error) {
        console.error('Error updating account balance:', error);
      }
    }
}
