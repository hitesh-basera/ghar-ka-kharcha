import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'; // Import MatDialogModule
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input';     // Import MatInputModule
import { MatDatepickerModule } from '@angular/material/datepicker'; // Import MatDatepickerModule
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';   // Import MatNativeDateModule or MatMomentDateModule
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { FinanceDbService } from '../../services/finance-db.service';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../shared/interfaces/category.model';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Transaction } from '../../shared/interfaces/transaction.model';
import { Account } from '../../shared/interfaces/account.model';
import { AccountService } from '../../services/account.service';
@Component({
  selector: 'app-add-transaction-dialog',
  standalone: true, // Mark as standalone
  providers: [provideNativeDateAdapter()],
  imports: [
    MatDialogModule,      // Import MatDialogModule
    ReactiveFormsModule,  // Import ReactiveFormsModule
    MatFormFieldModule,   // Import MatFormFieldModule
    MatInputModule,       // Import MatInputModule
    MatDatepickerModule,  // Import MatDatepickerModule
    MatNativeDateModule,  // Import MatNativeDateModule (or MatMomentDateModule if needed)
    MatButtonModule,      // Import MatButtonModule
    CommonModule,
    MatSelectModule
  ],
  templateUrl: './add-transaction-dialog.component.html',
  styleUrls: ['./add-transaction-dialog.component.scss']
})
export class TransactionDialogComponent implements OnInit {

  transactionForm!: FormGroup;
  categories$: Observable<Category[]> | undefined;
  accounts$: Observable<Account[]>|undefined;
  dialogTitle: string = '';
  saveButtonText: string = '';
  
  constructor(
    public dialogRef: MatDialogRef<TransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionDialogData,
    private fb: FormBuilder,
    private dexieService: FinanceDbService,
    private categoryService: CategoryService,
    private accountService: AccountService
  ) {
    //Keep contructor clean - no initialization
    }
  ngOnInit(): void {
    this.initializeForm();
    this.setupDialog();
    this.loadDropDownData();
    this.patchFormIfEditing();
  }
private initializeForm():void
{
  this.transactionForm = this.fb.group({
    date: [new Date(), Validators.required],
    accountId: [null, Validators.required],
    categoryId: [null, Validators.required],
    amount: [null, [Validators.required, Validators.min(0.01)]],
    description: ['']
  });
}
private setupDialog(): void {
  // Set title and button text based on the mode
  if (this.data.mode === 'edit') {
    this.dialogTitle = 'Edit Transaction';
    this.saveButtonText = 'Update';
  } else {
    this.dialogTitle = 'Add New Transaction';
    this.saveButtonText = 'Save';
  }
}
private patchFormIfEditing():void{
  console.log(this.data);
  if(this.data.mode === 'edit' && this.data.transaction){
    const transactionData ={
      ...this.data.transaction,
      date: new Date(this.data.transaction.date)
    };
    this.transactionForm.patchValue(transactionData)
  }
  else{//for add select account name
    const transactionData ={
      ...this.data.transaction,
    };
    this.transactionForm.patchValue(transactionData)
  }
}
private loadDropDownData(){
  this.categories$ = this.categoryService.categories$;
  this.accounts$ = this.accountService.accounts$;
}
// --- Getters ---
get description() { return this.transactionForm.get('description'); }
get amount() { return this.transactionForm.get('amount'); }
get date() { return this.transactionForm.get('date'); }
// Add getters for new controls
get accountId() { return this.transactionForm.get('accountId'); }
get categoryId() { return this.transactionForm.get('categoryId'); }

onSaveClick(): void {
    if (this.transactionForm.valid) {
      const transactionData = this.transactionForm.value;
      transactionData.account = this.data.transaction?.accountId;
      if(transactionData.id){
        this.dexieService.updateTransaction(transactionData).then(() => {
          this.dialogRef.close('transactionUpdated');
        }).catch(error => {
          console.error('Error updating transaction to Dexie:', error);
          // Handle error (e.g., show error message to user)
        });
      }
      else{
        this.dexieService.addTransaction(transactionData).then(() => {
          this.dialogRef.close('transactionAdded');
        }).catch(error => {
          console.error('Error adding transaction to Dexie:', error);
          // Handle error (e.g., show error message to user)
        });
      }
    }
  }
  
onCancelClick(): void {
  this.dialogRef.close();
}
}
export interface TransactionDialogData {
  mode: 'add' | 'edit';
  transaction?: Transaction; // Optional: Only provided in 'edit' mode
}