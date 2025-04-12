export interface Category {
  id?: number;//Auto-incremented ID
  name: string; // e.g., "Food", "Housing", "Transportation", "Income"
  // parentCategoryId?: number; // For subcategories (optional)
  // icon?: string; //icon name (optional)
  type:CategoryType;
}
export type CategoryType = 'income' | 'expense' | 'investment';