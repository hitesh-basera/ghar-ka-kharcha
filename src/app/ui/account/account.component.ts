import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FinanceDbService } from '../../services/finance-db.service';
import { Account } from '../../shared/interfaces/account.model';
import { Category } from '../../shared/interfaces/category.model';
import { Transaction } from '../../shared/interfaces/transaction.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AccountHeaderComponent } from "../account-header/account-header.component";
import { ActivatedRoute, Data } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { AccountService } from '../../services/account.service';
import { TransactionDialogComponent, TransactionDialogData } from '../add-transaction-dialog/add-transaction-dialog.component';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { ExpenseInputComponent } from "../expense-input/expense-input.component";

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatIconModule, MatDialogModule, AccountHeaderComponent, ExpenseInputComponent],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent implements OnInit, OnDestroy {
  allAccounts: Account[] = [];
  categories: Category[] = [];
  transactions: Transaction[] = [];
  selectedAccount: Account | undefined;
  accountSubscription: Subscription | undefined;
  newTransaction: Transaction = { // Initialize newTransaction object
    date: new Date(),
    accountId: 0, // Initialize to a default value (or null)
    categoryId: 0, // Initialize to a default value (or null)
    amount: 0,
    description: ''
  };
  editingTransaction: Transaction | null = null; // To track the editing transaction
  filter: { startDate?: Date; endDate?: Date; accountId?: number; categoryId?: number } = {}; // Initialize filter
  transactionForm!: FormGroup; // Define the form group
  transactionFilterForm!: FormGroup;

  constructor(
    private financeDbService: FinanceDbService,
    private fb: FormBuilder,// Inject FormBuilder
    private route: ActivatedRoute,
    private accountService: AccountService,
    public dialog: MatDialog
  ) {}

  ngOnInit():void {
    this.accountSubscription = this.accountService.selectedAccount$.subscribe(accountName => {
      this.selectedAccount = accountName;
      if (this.selectedAccount) {
        this.loadTransactions(); // Load transactions for the selected account
      } 
      else {
        this.loadTransactions();// show all accounts
      }
      this.loadData();
    });

    // Initialize the form in ngOnInit
    this.transactionForm = this.fb.group({
      date: new Date(), // Initialize with current date
      accountId: null, 
      categoryId: null,
      amount: 0,
      description: ''
    });

    this.transactionFilterForm = this.fb.group({
        startDate: null,
        endDate: null,
        accountId: null,
        categoryId: null
    });
  }
  ngOnDestroy(): void {
    if (this.accountSubscription) {
      this.accountSubscription.unsubscribe(); // Prevent memory leaks
    }
  }
  async loadData() {
    this.allAccounts = await this.financeDbService.getAccounts();
    this.categories = await this.financeDbService.getCategories();
  }
  async loadTransactions() {
    if(this.selectedAccount) {
      this.transactions = await this.financeDbService.getTransactionsByAccountId(this.selectedAccount.id?this.selectedAccount.id:0);
  }
  else{
    this.transactions = await this.financeDbService.getTransactions(this.filter);
  }
}
getAccountName(accountId: number): string {
  const account = this.allAccounts.find(a => a.id === accountId);
  return account ? account.name : ''; // Return empty string if not found
}
getCategoryName(categoryId: number): string {
  const category = this.categories.find(c => c.id === categoryId);
  return category ? category.name : '';
}

// getSubcategories(parentCategoryId: number): Category[] {
//   return this.categories.filter(c => c.parentCategoryId === parentCategoryId);
// }

editTransaction(transaction: Transaction) {
  const dialogData: TransactionDialogData = {
    mode: 'edit',
    transaction:{...transaction}
  };

  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true; // Prevent closing by clicking outside
  dialogConfig.autoFocus = true;    // Focus the first form field
  dialogConfig.width = '450px';
  dialogConfig.data = dialogData;

  if (transaction.id) {
        const dialogRef = this.dialog.open(TransactionDialogComponent, dialogConfig);
  
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            if (this.selectedAccount) {
              this.accountService.setSelectedAccount(this.selectedAccount);
            }
          }
          else{
            console.log('Edit dialog cancelled');
          }
        });
      }
}

async saveTransaction(transaction: Transaction) {
  if(this.editingTransaction){
    try {
      await this.financeDbService.updateTransaction(transaction); // Update in the database
      this.editingTransaction = null;
      this.loadTransactions();
  } catch (error) {
      console.error('Error updating transaction:', error);
  }
  }
}

cancelEdit() {
  this.editingTransaction = null;
}

async deleteTransaction(id: number|undefined) {
  try {
      await this.financeDbService.deleteTransaction(id??0);
      this.loadTransactions();
  } catch (error) {
      console.error("Error deleting transaction:", error);
  }
}
onImportTransactions() {
  // Implement import logic
  console.log("Import Transactions clicked");
}

onAddTransaction() {
  // Implement add transaction logic
  console.log("Add Transaction clicked");
}

onFilterTransactions() {
  // Implement filter logic
  console.log("Filter Transactions clicked");
}

onSearchTransactions(searchTerm: string) {
  // Implement search/filter logic based on searchTerm
  console.log("Search term:", searchTerm);
  // You can filter your transactions array here
  // Example:
  this.transactions = this.transactions.filter(transaction => {
      // Customize filter logic as needed
      return (
          transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          this.getAccountName(transaction.accountId).toLowerCase().includes(searchTerm.toLowerCase()) ||
          this.getCategoryName(transaction.categoryId).toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.amount.toString().includes(searchTerm) ||
          transaction.date.toLocaleDateString().includes(searchTerm)
      );
  });
}
async onTransactionsAdded(): Promise<void> {
this.loadTransactions(); // Refresh the grid
}
}
