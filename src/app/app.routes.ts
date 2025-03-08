import { ActivatedRouteSnapshot, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AccountComponent } from './ui/account/account.component';
import { FinanceDbService } from './services/finance-db.service';
import { from, Observable, of } from 'rxjs';
import { Account } from './shared/interfaces/account.model';
import { inject } from '@angular/core';
import { CategoryComponent } from './ui/category/category.component';

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
        
      },
      {path:'home',
        component:HomeComponent
      },
      {path: 'category', component:CategoryComponent},
      {path: 'account/:id', component: AccountComponent, resolve:{
        selectedAccount: (route:ActivatedRouteSnapshot):Observable<Account | undefined>=>{
          const financeDbService = inject(FinanceDbService);
          const id = route.paramMap.get('id');
          if(id){
            return from(financeDbService.getAccountById(+id));
          }
          return of(undefined);
          
        }
      }, pathMatch: 'full'},
    {path: 'home', redirectTo: '/home', pathMatch: 'full'},
    {path: 'login', redirectTo: '/login', pathMatch: 'full'},
    {path: 'category', redirectTo: '/category', pathMatch:'full'},
    {path: '', redirectTo: '/home', pathMatch: 'full'},
];
