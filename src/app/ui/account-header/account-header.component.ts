import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Account } from '../../shared/interfaces/account.model';
import { MatIconModule } from '@angular/material/icon'; // Import used Material modules
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AccountService } from '../../services/account.service';
import { AddTransactionDialogComponent } from '../add-transaction-dialog/add-transaction-dialog.component';
@Component({
  selector: 'app-account-header',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, CommonModule, MatDialogModule],
  templateUrl: './account-header.component.html',
  styleUrl: './account-header.component.scss'
})
export class AccountHeaderComponent implements OnInit {
  //@Input() account: Account | null = null; // Make account nullable
  @Output() importTransactions = new EventEmitter<void>();
  //@Output() addTransaction = new EventEmitter<void>();
  @Output() filterTransactions = new EventEmitter<void>();
  @Output() searchTransactions = new EventEmitter<string>(); // Emit the search term
  @Input() selectedAccount: Account | undefined; 
  /**
   *
   */
  constructor(public dialog: MatDialog,private accountService: AccountService,) {
    
    
  }
  ngOnInit(): void {
    this.selectedAccount = this.accountService.getSelectedAccount();
  }
  openAddTransactionDialog(): void
  {
    if (this.selectedAccount) {
      const dialogRef = this.dialog.open(AddTransactionDialogComponent, {
        width: '400px',
        data: { accountName: this.selectedAccount.name }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 'transactionAdded') {
          if (this.selectedAccount) {
            this.accountService.setSelectedAccount(this.selectedAccount);
          }
        }
      });
    }
  }
  searchTransaction(event: Event) {
    const target = event.target as HTMLInputElement; // Type assertion

    const searchTerm = target?.value ?? ''; // Optional chaining and nullish coalescing
    this.searchTransactions.emit(searchTerm);
}
}
