export interface Transaction {
    id?: number;
    date: Date;
    accountId: number;
    categoryId: number;
    amount: number;
    description?: string; // Optional description
}
