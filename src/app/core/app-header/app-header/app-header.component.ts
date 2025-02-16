import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { FinanceDbService } from '../../../services/finance-db.service';
import { Account } from '../../../shared/interfaces/account.model';
import { MatDialog } from '@angular/material/dialog';
import { NewAccountComponent } from '../../../new-account/new-account.component';
import { AccountService } from '../../../services/account.service';
import { MatSelectionListChange } from '@angular/material/list'; 

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule,CovalentLayoutModule, MatButtonModule, MatButtonToggleModule, MatIconModule, MatListModule],
  templateUrl: './app-header.component.html',
  styleUrl: './app-header.component.scss'
})
export class AppHeaderComponent implements OnInit{
  title = 'Ghar ka kharcha';
  selectedAccount: Account | undefined = undefined; // Initially no account selected or default
  @Input() accounts: Account[] = []; // Input all accounts
  //@Output() accountSelected = new EventEmitter<Account>(); // Emit selected account
  constructor(public router: Router,public dialog: MatDialog, private financeDbService: FinanceDbService, private accountService: AccountService) {
  }
  ngOnInit() {
    this.loadData()
  }
  
  shouldDisplay(): boolean {
    return true;//show sidebar menu without log in as of now
  }
  
openNewAccountDialog()
{
const dialogRef = this.dialog.open(NewAccountComponent,{
    minWidth:'450px',
    minHeight:'220px'
  });
  
  dialogRef.afterClosed().subscribe(result=>{
    if(result){
      this.financeDbService.addAccount(result).then(() => {
        this.loadData();
    }).catch(error => {
        console.error("Error adding account:", error);
    });
    }
  })
}
async loadData() {
  this.accounts = await this.financeDbService.getAccounts();
  // this.categories = await this.financeDbService.getCategories();
  // this.loadTransactions();
}
onAccountSelect(event: MatSelectionListChange)
{
  //this.accountSelected.emit(account); 
  if(event.options && event.options.length>0){
    this.selectedAccount = event.options[0].value; // Or however you get the selected account name
    this.accountService.setSelectedAccount(this.selectedAccount); // Update the service
  }else {
    this.selectedAccount = undefined; // No option selected (or deselected all)
    this.accountService.setSelectedAccount(undefined);
  }
  
}
}
