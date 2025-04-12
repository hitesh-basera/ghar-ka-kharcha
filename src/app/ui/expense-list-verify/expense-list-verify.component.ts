import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Account } from '../../shared/interfaces/account.model';
import { Category } from '../../shared/interfaces/category.model';
import { Transaction } from '../../shared/interfaces/transaction.model';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FinanceDbService } from '../../services/finance-db.service';
import { AccountService } from '../../services/account.service';
import { CategoryService } from '../../services/category.service';
import { filter, firstValueFrom, from, switchMap, take } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-expense-list-verify',
  standalone: true,
  imports: [MatDialogModule,CommonModule, MatButtonModule],
  templateUrl: './expense-list-verify.component.html',
  styleUrl: './expense-list-verify.component.scss'
})
export class ExpenseListVerifyComponent implements OnInit {
  // @Output() transactionsAdded = new EventEmitter<void>(); // EventEmitter for parent notification
  categories: Category[] = [];
  // transactions: Transaction[] = [];
  selectedAccount!: string|undefined;
  //editingTransaction: Transaction | null = null; // To track the editing transaction
  suggestedTransactions: Transaction[] = [];
  errorMessage = '';

  constructor(public dialogRef: MatDialogRef<ExpenseListVerifyComponent>,@Inject(MAT_DIALOG_DATA) public data: Transaction[],
  private financeService: FinanceDbService,private accountService: AccountService,private categoryService: CategoryService){
    
  }
  ngOnInit(): void {
    this.accountService.selectedAccount$.subscribe(account=>{
      this.selectedAccount= account?.name;
    })
    this.suggestedTransactions=this.data;
    this.loadData();
  }
  async loadData() {
    this.categories = await this.financeService.getCategories();
  }
  getCategoryName(categoryId: number) {
    // const category = await firstValueFrom(this.categoryService.categories$.pipe(switchMap(catObjects => from(catObjects)),
    // filter((catObject:Category)=>catObject.id==categoryId),
    // take(1)
    // ));
    //this.categories = await this.financeService.getCategories();
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.name : '';
  }
  saveTransactions():void{
    //get and pass data then emit event and close popup
    this.addBulkTransactions();
  }
  private addBulkTransactions():void{
    this.financeService.addTransactions(this.suggestedTransactions).then(()=>{
      this.accountService.updateAccountBalance(this.suggestedTransactions).then(()=>{
        this.dialogRef.close('Added bulk transactions');
      });
    })
    .catch((error)=>{
      this.errorMessage = 'Failed to save transactions.';
    });
    
  }
  onCancelClick(): void {
    this.dialogRef.close();
  }
}
