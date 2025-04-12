import {CdkTextareaAutosize, TextFieldModule} from '@angular/cdk/text-field';
import { afterNextRender, Component, EventEmitter, inject, Injector, OnInit, Output, ViewChild } from '@angular/core';
import { Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AccountService } from '../../services/account.service';
import { CommonModule } from '@angular/common';
import { FinanceDbService } from '../../services/finance-db.service';
import { Category } from '../../shared/interfaces/category.model';
import { map, Observable, Subject } from 'rxjs';
import { Transaction } from '../../shared/interfaces/transaction.model';
import { CategoryService } from '../../services/category.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ExpenseListVerifyComponent } from '../expense-list-verify/expense-list-verify.component';

@Component({
  selector: 'app-expense-input',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,MatFormFieldModule,MatInputModule,TextFieldModule],
  templateUrl: './expense-input.component.html',
  styleUrl: './expense-input.component.scss'
})
export class ExpenseInputComponent implements OnInit {
  private _injector = inject(Injector);
  @Output() transactionsAdded = new EventEmitter<void>(); // EventEmitter for parent notification
  expenseDescription = new FormControl('', Validators.required);
  allCategories$!: Observable<Category[]>;
  suggestedTransactions: Transaction[] = [];
  accountId!: number|undefined;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  @ViewChild('autosize') autosize!: CdkTextareaAutosize;

  triggerResize() {
    // Wait for content to render, then trigger textarea resize.
    afterNextRender(
      () => {
        this.autosize.resizeToFitContent(true);
      },
      {
        injector: this._injector,
      },
    );
  }

  constructor(private accountService: AccountService,private categoryService:CategoryService,
    private financeService: FinanceDbService, public dialog: MatDialog,){
  }
  ngOnInit(): void {
    //this.expenseForm.patchValue({accountId: this.accountService.getSelectedAccount()?.id})
    this.allCategories$ = this.categoryService.categories$;
    this.accountService.selectedAccount$.subscribe(account=>{
      this.accountId= account?.id
    })
  }
  onSubmit(): void{
    if(this.expenseDescription.value && this.accountId){
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.allCategories$.subscribe({
      next: (categories) => {
        this.financeService
          .suggestTransactions(
            this.expenseDescription.value!,
            categories,
            this.accountId??0
          )
          .subscribe({
            next: (transactions)=>{
              this.errorMessage = '';
              this.isLoading=false;
              this.successMessage="Verify suggested transactions";

              const dialogData: Transaction[] = transactions;
              const dialogConfig = new MatDialogConfig();
                dialogConfig.disableClose = true; // Prevent closing by clicking outside
                dialogConfig.autoFocus = true;    // Focus the first form field
                dialogConfig.width = '761px';
                dialogConfig.data = dialogData;

              //this.suggestedTransactions = transactions;
              const dialogRef = this.dialog.open(ExpenseListVerifyComponent, dialogConfig);
              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  this.successMessage="";
                  this.transactionsAdded.emit();
                  this.expenseDescription.reset();
                }
                else{
                  this.successMessage="";
                  console.log('Edit dialog cancelled');
                }
              });
            },
            error: (error)=>
            {
              this.errorMessage = 'Failed to get transactions suggestions';
              console.error('Error:', error);
              this.isLoading=false;
            },
          });
    },
    error:(error)=>{
      this.errorMessage = 'Failed to fetch categories.';
          console.error('Error fetching categories:', error);
          this.isLoading = false;
    },
    });
  }
    else {
      this.errorMessage = 'Please enter an expense description and select account.';
    }
  }
  // addBulkTransactions():void{
  //   this.financeService.addTransactions(this.suggestedTransactions).then(()=>{
  //     this.transactionsAdded.emit();
  //   })
  //   .catch((error)=>{
  //     this.errorMessage = 'Failed to save transactions.';
  //   });
    
  // }
  
}