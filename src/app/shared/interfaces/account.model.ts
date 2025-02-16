export interface Account {
    id?: number;
    name: string;//"Checking", "Savings", "Credit Card"
    type: string;//"Asset", "Liability"
    balance: number;
}
