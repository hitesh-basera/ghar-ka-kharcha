import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog'; // Import MatDialogModule
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Import ReactiveFormsModule
import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input';     // Import MatInputModule
import { MatDatepickerModule } from '@angular/material/datepicker'; // Import MatDatepickerModule
import { MatNativeDateModule } from '@angular/material/core';   // Import MatNativeDateModule or MatMomentDateModule
import { MatButtonModule } from '@angular/material/button'; // Import MatButtonModule
import { FinanceDbService } from '../../services/finance-db.service';

@Component({
  selector: 'app-add-transaction-dialog',
  standalone: true, // Mark as standalone
  imports: [
    MatDialogModule,      // Import MatDialogModule
    ReactiveFormsModule,  // Import ReactiveFormsModule
    MatFormFieldModule,   // Import MatFormFieldModule
    MatInputModule,       // Import MatInputModule
    MatDatepickerModule,  // Import MatDatepickerModule
    MatNativeDateModule,  // Import MatNativeDateModule (or MatMomentDateModule if needed)
    MatButtonModule      // Import MatButtonModule
  ],
  templateUrl: './add-transaction-dialog.component.html',
  styleUrls: ['./add-transaction-dialog.component.scss']
})
export class AddTransactionDialogComponent {

  transactionForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { accountName: string },
    private fb: FormBuilder,
    private dexieService: FinanceDbService
  ) {
    this.transactionForm = this.fb.group({
      date: [new Date(), Validators.required],
      account: [{ value: data.accountName, disabled: true }, Validators.required],
      category: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      description: ['']
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.transactionForm.valid) {
      const transactionData = this.transactionForm.value;
      transactionData.account = this.data.accountName;

      this.dexieService.addTransaction(transactionData).then(() => {
        this.dialogRef.close('transactionAdded');
      }).catch(error => {
        console.error('Error adding transaction to Dexie:', error);
        // Handle error (e.g., show error message to user)
      });
    }
  }
}