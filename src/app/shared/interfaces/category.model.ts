export interface Category {
  id?: number;
  name: string; // e.g., "Food", "Housing", "Transportation", "Income"
  parentCategoryId?: number; // For subcategories (optional)
}
