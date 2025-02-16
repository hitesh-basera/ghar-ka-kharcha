import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NewAccountComponent } from '../new-account/new-account.component';
import { FinanceDbService } from '../services/finance-db.service';
import { CommonModule } from '@angular/common';
import { Account } from '../shared/interfaces/account.model';
import { AccountComponent } from "../ui/account/account.component";
//import { Account } from '../shared/interfaces/account';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatButtonModule, CommonModule, AccountComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  accounts: Account[] = []; // Initialize accounts as an empty array
  //newAccount: Account = { id: 0, name: '', balance: 0 }; // Initialize newAccount
  errorMessage: string | undefined;

constructor(public dialog: MatDialog,private financeDBService: FinanceDbService){}

ngOnInit(): void {
  this.loadData();
}
openNewAccountDialog(){
  const dialogRef = this.dialog.open(NewAccountComponent,{
    minWidth:'450px',
    minHeight:'220px'
  });
  
  dialogRef.afterClosed().subscribe(result=>{
    if(result){
      console.log("After Dialog Close");
      console.log(result);
      this.financeDBService.addAccount(result).then(() => {
        //this.loadData(); // Refresh the account list
    }).catch(error => {
        console.error("Error adding account:", error);
    });
    }
  })
}
async loadData() {
  this.accounts = await this.financeDBService.getAccounts();
  // this.categories = await this.financeDbService.getCategories();
  // this.loadTransactions();
}
getAccounts() {
  // this.accountService.getAccounts().subscribe({
  //     next: (accounts) => this.accounts = accounts,
  //     error: (error) => this.errorMessage = error
  // });
}
}
