import { Injectable } from '@angular/core';
import { Account } from '../shared/interfaces/account.model';
import { Category } from '../shared/interfaces/category.model';
import { Transaction } from '../shared/interfaces/transaction.model';
import Dexie, { Table } from 'dexie';
import { catchError, from, Observable, of, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class FinanceDbService {
  private db: MyDatabase;
  private askGemini = 'http://localhost:3001/api/askGemini/';
  constructor(private http: HttpClient) { 
    this.db = new MyDatabase(); // Database name
    this.populateSampleDataIfNeeded();
  }
  // Account Operations
  async addAccount(account: Account): Promise<number> {
    return await this.db.accounts.add(account);
  }
  addAccounts(accounts: Account[]): Promise<number> { // Method to add multiple accounts
    return this.db.accounts.bulkAdd(accounts);
  }
  async getAccounts(): Promise<Account[]> {
    return await this.db.accounts.toArray();
  }
  async updateAccount(account:Account):Promise<number>
  {
    return await this.db.accounts.put(account);
    }
  // Category Operations
  async addCategory(category: Category): Promise<number> {
    return await this.db.categories.add(category);
  }
  addCategories(categories: Category[]): Promise<number> { // Method to add multiple categories
    return this.db.categories.bulkAdd(categories);
  }
  async getCategories(): Promise<Category[]> {
    return await this.db.categories.toArray();
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return await this.db.categories.get(id);
  }

  async getCategoriesByAccount(accountId: number):Promise<Category[]>{
    return await this.db.categories.where('accountId').equals(accountId).toArray();
  }
  async getSubcategories(parentCategoryId: number): Promise<Category[]> {
    return await this.db.categories.where('parentCategoryId').equals(parentCategoryId).toArray();
  }

  async updateCategory(category:Category):Promise<number>{
    return await this.db.categories.put(category);
    }
  async deleteCategory(id: number):Promise<void>{
    return await this.db.categories.delete(id);
  }

  // Transaction Operations
  suggestTransactions(
    expenseText: string,
    categories: Category[],
    accountId: number
  ): Observable<Transaction[]> {
  if (!expenseText) {
      // Return an observable error if parsing fails
      return throwError(() => new Error('Invalid expense text format. Could not parse description.'));
  }
  // 2. Call Backend for Categorization
  return this.http.post<Transaction[]>(this.askGemini+'process', {
    description: expenseText,
    categories: categories,
    accountId: accountId,}
  ).pipe(
    catchError(error => {
      // Handle errors from HTTP call or Dexie save
      console.error('Error in categorizeAndSaveTransaction:', error);
      return throwError(() => new Error('Failed to process text and generate transactions.'));
    })
  );
  }
  async addTransaction(transaction: Transaction): Promise<number> {
    return await this.db.transactions.add(transaction);
  }
  addTransactions(transactions: Transaction[]): Promise<number> { // Method to add multiple categories
    return this.db.transactions.bulkAdd(transactions);
  }
  async updateTransaction(transaction:Transaction):Promise<number>{
    return await this.db.transactions.put(transaction);
    }
  async deleteTransaction(id: number):Promise<void>{
    return await this.db.transactions.delete(id);
  }
  async getTransactions(filter?: { startDate?: Date; endDate?: Date; accountId?: number; categoryId?: number }): Promise<Transaction[]> {
    let collection = this.db.transactions.toCollection();

    if (filter) {
      collection = collection.filter(transaction => {
        let match = true; // Start with a match

        if(filter.startDate) {
            match = match && transaction.date >= filter.startDate;
        }
        if(filter.endDate) {
          match = match && transaction.date <= filter.endDate;
        }
        if(filter.accountId) {
          match = match && transaction.accountId === filter.accountId;
        }
        if(filter.categoryId) {
          match = match && transaction.categoryId === filter.categoryId;
        }
        return match;
    });
  }
    return await collection.toArray();
  }
  async getTransactionsByAccountId(id:number){
    return await this.db.transactions.where('accountId').equals(id).toArray();
  }
  async getTransactionById(id: number): Promise<Transaction | undefined> {
    return await this.db.transactions.get(id);
  }
async getAccountById(accountId: number):Promise<Account | undefined>{
  return await this.db.accounts.get(accountId);
}
  // Example: Get transactions for a specific account and category within a date range
  async getTransactionsByAccountAndCategory(accountId: number, categoryId: number, startDate: Date, endDate: Date): Promise<Transaction[]> {
    return await this.db.transactions
        .where('accountId').equals(accountId)
        .and(transaction => transaction.categoryId === categoryId)
        .and(transaction => transaction.date >= startDate && transaction.date <= endDate)
        .toArray();
}

async isDatabaseEmpty(): Promise<boolean> { // Helper to check if DB is empty
  const transactionCount = await this.db.transactions.count();
  const accountCount = await this.db.accounts.count();
  const categoryCount = await this.db.categories.count();
  return transactionCount === 0 && accountCount === 0 && categoryCount === 0;
}
private async populateSampleDataIfNeeded(): Promise<void> { // Method to populate sample data
  if (await this.isDatabaseEmpty()) {
    console.log('Database is empty, populating with sample data...');
    await this.addSampleAccounts();
    await this.addSampleCategories();
    await this.addSampleTransactions();
    console.log('Sample data population complete.');
  } else {
    console.log('Database is not empty, skipping sample data population.');
  }
}
private async addSampleAccounts(): Promise<void> {
  const sampleAccounts: Account[] = [
    { name: 'Current Account', type: 'Asset', balance: 1500.50 },
    { name: 'Savings Account', type: 'Asset', balance: 5200.00 },
    { name: 'Credit Card', type: 'Liability', balance: -345.75 }, // Negative balance for liability
  ];
  await this.addAccounts(sampleAccounts);
}

private async addSampleCategories(): Promise<void> {
  const sampleCategories: Category[] = [
    { name: 'Income', parentCategoryId: undefined,icon:  'attach_money',type:'income'}, // Top-level category
    { name: 'Salary', parentCategoryId: 1 ,icon:  'monetization_on',type:'income'},        // Subcategory of Income (assuming Income gets id 1)
    { name: 'Food', parentCategoryId: 3 , icon:  'restaurant',type:'expense'},
    { name: 'Housing', parentCategoryId: 3 ,icon:  'home',type:'expense'},
    { name: 'Transportation', parentCategoryId: 3 ,icon:  'directions_bus',type:'expense'},
    { name: 'Utilities', parentCategoryId: 5 ,icon:  'lightbulb_circle',type:'expense'}, // Subcategory of Housing (assuming Housing gets id 5)
    { name: 'Gifts', parentCategoryId: 3 ,icon: 'featured_seasonal_and_gifts',type:'expense'},
  ];
  await this.addCategories(sampleCategories);
}


private async addSampleTransactions(): Promise<void> {
  // Assuming Account IDs and Category IDs will be auto-generated by Dexie
  // You might need to fetch categories and accounts to get their IDs after adding them
  const accounts = await this.getAccounts();
  const categories = await this.getCategories();

  const checkingAccount = accounts.find(acc => acc.name === 'Current Account');
  const savingsAccount = accounts.find(acc => acc.name === 'Savings Account');
  const creditCardAccount = accounts.find(acc => acc.name === 'Credit Card');

  const foodCategory = categories.find(cat => cat.name === 'Food');
  const salaryCategory = categories.find(cat => cat.name === 'Salary');
  const utilitiesCategory = categories.find(cat => cat.name === 'Utilities');
  const transportationCategory = categories.find(cat => cat.name === 'Transportation');


  if (checkingAccount && foodCategory && salaryCategory && utilitiesCategory && transportationCategory && savingsAccount && creditCardAccount) {
    const sampleTransactions: Transaction[] = [
      { date: new Date('2023-11-01'), accountId: checkingAccount.id!, categoryId: foodCategory.id!, amount: 35.50, description: 'Lunch with colleagues' },
      { date: new Date('2023-10-28'), accountId: checkingAccount.id!, categoryId: salaryCategory.id!, amount: 2500.00, description: 'Monthly Salary' },
      { date: new Date('2023-10-25'), accountId: savingsAccount.id!, categoryId: utilitiesCategory.id!, amount: 120.00, description: 'Electricity Bill' },
      { date: new Date('2023-10-20'), accountId: creditCardAccount.id!, categoryId: transportationCategory.id!, amount: 55.75, description: 'Train tickets' },
      { date: new Date('2023-10-15'), accountId: checkingAccount.id!, categoryId: foodCategory.id!, amount: 15.20, description: 'Coffee and pastry' },
      // ... add more sample transactions ...
    ];
    await this.addTransactions(sampleTransactions);
  } else {
    console.warn('Could not find required Accounts or Categories to create sample transactions.');
  }
}


// Example: Get total expenses for a category
async getCategoryExpenses(categoryId: number, startDate?: Date, endDate?: Date): Promise<number> {
  return await this.db.transactions.filter(transaction => {
    let match = transaction.categoryId === categoryId;

    if (startDate) {
        match = match && transaction.date >= startDate;
    }

    if (endDate) {
        match = match && transaction.date <= endDate;
    }

    return match;
}).toArray().then(transactions => { // Use .then() to process the array
    return transactions.reduce((sum, transaction) => {
        return transaction.amount < 0 ? sum + transaction.amount : sum;
    }, 0);
});
}

// Basic parsing function (Needs improvement for real-world use)
private parseExpenseText(text: string): { amount: number; description: string } {
  // Example: Find first number as amount, rest as description
  // WARNING: Replace with robust REGEX for currency symbols (₹, $ etc.), decimals, separators.
  const amountMatch = text.match(/(\d+(\.\d+)?)/);
  let amount = 0;
  let description = text.trim();

  if (amountMatch) {
      amount = parseFloat(amountMatch[0]);
      description = text.replace(amountMatch[0], '').replace(/rs\.?|₹|inr|for|on|spent/gi, '').trim();
       // Handle cases where description might become empty after stripping amount/keywords
       if (!description) {
           description = "Unspecified Expense";
       }
  }
  // If no amount found, return 0 or handle error appropriately
  return { amount, description };
}
}
// Define your Dexie database class
class MyDatabase extends Dexie {
  transactions!: Table<Transaction, number>;
  accounts!: Table<Account, number>;    // Add accounts table
  categories!: Table<Category, number>;  // Add categories table

  constructor() {
    super('FinanceTrackerDB');
    this.version(1).stores({
      transactions: '++id, date, accountId, categoryId, amount, description', // Use accountId, categoryId
      accounts: '++id, name, type, balance', // Define accounts table schema
      categories: '++id, name, parentCategoryId' // Define categories table schema
    });
  }
}