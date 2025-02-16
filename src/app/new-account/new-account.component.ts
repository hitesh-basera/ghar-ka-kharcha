import { Component, Inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Account } from '../shared/interfaces/account.model';
//import { AccountService } from '../services/account.service';
import { FinanceDbService } from '../services/finance-db.service';
import { Transaction } from '../shared/interfaces/transaction.model';
import { Category } from '../shared/interfaces/category.model';

@Component({
  selector: 'app-new-account',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule, MatInputModule,MatSelectModule, MatButtonModule, MatIconModule, MatFormFieldModule],
  templateUrl: './new-account.component.html',
  styleUrl: './new-account.component.scss'
})
export class NewAccountComponent{
  accounts: Account[] = [];
  categories: Category[] = [];
  transactions: Transaction[] = [];
  newTransaction: Transaction = { // Initialize newTransaction object
    date: new Date(),
    accountId: 0, // Initialize to a default value (or null)
    categoryId: 0, // Initialize to a default value (or null)
    amount: 0,
    description: ''
  };
  filter: { startDate?: Date; endDate?: Date; accountId?: number; categoryId?: number } = {}; // Initialize filter
  transactionForm!: FormGroup; // Define the form group
  transactionFilterForm!: FormGroup;
  
  accountForm: FormGroup;
  
  constructor(public dialogRef: MatDialogRef<NewAccountComponent>,@Inject(MAT_DIALOG_DATA) public data: Account,
   private financeDbService: FinanceDbService, private fb: FormBuilder) {

    this.accountForm = this.fb.group({
      name: ['', Validators.required], // Name is required
      type: ['Asset'], // Default to Asset
      balance: [0]
    });

    if (data) { // If editing, pre-fill the form
      this.accountForm.patchValue(data);
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  
  saveAccount(): void {
    if (this.accountForm.valid) {
        const account: Account = this.accountForm.value;
        this.dialogRef.close(account); // Pass the account data back to the caller
    }
  }
}
