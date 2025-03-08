import { Injectable } from '@angular/core';
import { FinanceDbService } from './finance-db.service';
import { Category } from '../shared/interfaces/category.model';
import { BehaviorSubject, from, map, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
// BehaviorSubject to hold the categories
private categoriesSubject = new BehaviorSubject<Category[]>([]);
// Observable for components to subscribe to
categories$: Observable<Category[]> = this.categoriesSubject.asObservable();
  constructor(private db: FinanceDbService) { 
    // Load initial data from IndexedDB
    this.loadCategories();
  }
  // Load categories from IndexedDB and emit them through the BehaviorSubject
  private async loadCategories(): Promise<void> {
    const categories = await this.db.getCategories();
    this.categoriesSubject.next(categories);
  }
//  async addCategory(category: Category) {
//       await this.db.addCategory(category);
//       await this.loadCategories();
//     }
  addCategory(category: Category): Observable<number> {
      return from(this.db.addCategory(category)).pipe(
        map((id) => {
          this.loadCategories(); // Reload categories after adding
          return id;
        })
      );
    }
    
  addCategories(categories: Category[]): Observable<number> {
    return from(this.db.addCategories(categories)).pipe(
      map(() => {
        this.loadCategories();
        return 0; // bulkAdd returns 0
      })
    );
  }
  getCategoryById(id: number): Observable<Category | undefined> {
    return from(this.db.getCategoryById(id));
  }
  getSubcategories(parentCategoryId: number): Observable<Category[]> {
    return from(this.db.getSubcategories(parentCategoryId));
  }

  updateCategory(category: Category): Observable<number> {
    return from(this.db.updateCategory(category)).pipe(
      map(() => {
        this.loadCategories();
        return category.id??0;
      })
    );
  }

  deleteCategory(id: number): Observable<void> {
    return from(this.db.deleteCategory(id)).pipe(
      map(() => {
        this.loadCategories();
        return undefined;
      })
    );
  }
}
