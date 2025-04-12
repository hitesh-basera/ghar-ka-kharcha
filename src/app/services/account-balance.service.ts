import { Injectable } from '@angular/core';
import { FinanceDbService } from './finance-db.service';
import { CategoryService } from './category.service';
import { Category } from '../shared/interfaces/category.model';
import { Transaction } from '../shared/interfaces/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class AccountBalanceService {

  constructor(private financeService: FinanceDbService, private categoryService: CategoryService) { 

  }
  async updateAccountBalance(suggestedTransactions: Transaction[]){
    try{
      const accountId = await suggestedTransactions.map((s)=>s.accountId)[0];//all transactions are part of same account
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
        const account = await this.financeService.getAccountById(accountId);
        if (account) {
          const newBalance = (account.balance || 0) + balanceChange;
          account.balance=newBalance;
          await this.financeService.updateAccount(account);
          console.log(`Account ${accountId} balance updated to: ${newBalance}`);
        } else {
          console.warn(`Account with ID ${accountId} not found.`);
        }
      }
    }
    catch (error) {
      console.error('Error updating account balance:', error);
    }
  }
  // async updateAccountBalance(accountId: number){
    
  // }
}
