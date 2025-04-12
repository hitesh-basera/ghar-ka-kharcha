import { Component, inject, OnInit } from '@angular/core';
import { Category } from '../../shared/interfaces/category.model';
import { CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatSnackBarModule, MatTableModule, MatButtonModule, MatIconModule, MatFormFieldModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  displayedColumns: string[] = ['name', 'actions'];
  //categories: Category[]|undefined = [];
  dataSource = new MatTableDataSource<Category>();
  private categoryService = inject(CategoryService); // only for standalone components
  ngOnInit(): void {
    this.categoryService.categories$.subscribe((categories) => {
      //this.categories = categories;
      this.dataSource.data = categories;
    });
  }
  constructor(private dialog:MatDialog,
    categoryService: CategoryService,
    private snackBar: MatSnackBar
    
  ){ // only for module based components
    this.categoryService = categoryService;
  }
  openDialog(category?:Category){
    const dialogRef = this.dialog.open(CategoryDialogComponent,{
      width: '400px',
      data: category?{...category}:{},
    });
    dialogRef.afterClosed().subscribe((result)=>{
      if(result){
        if(result.id){
          this.categoryService.updateCategory(result).subscribe(()=>{
            this.snackBar.open('Category updated','OK',{duration: 2000});
          });
        } else{
          this.categoryService.addCategory(result).subscribe(()=>{
            this.snackBar.open("Category updated","OK",{duration:2000});
          });
        }
      }
    })
  }
  deleteCategory(id: number):void{
    this.categoryService.deleteCategory(id).subscribe(()=>{
      this.snackBar.open("Category deleted","OK", {duration:2000});
    });
  }
}
