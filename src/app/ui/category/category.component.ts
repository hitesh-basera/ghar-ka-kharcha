import { Component, inject, OnInit } from '@angular/core';
import { Category } from '../../shared/interfaces/category.model';
import { CategoryService } from '../../services/category.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop'
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  categories: Category[]|undefined = [];
  private categoryService = inject(CategoryService); // only for standalone components
  ngOnInit(): void {
    this.categoryService.categories$.subscribe((categories) => {
      this.categories = categories;
    });
  }
  constructor(categoryService: CategoryService){ // only for module based components
    this.categoryService = categoryService;
  }
}
