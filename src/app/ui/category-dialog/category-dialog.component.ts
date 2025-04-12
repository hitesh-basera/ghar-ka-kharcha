import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Category, CategoryType } from '../../shared/interfaces/category.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, FormsModule,ReactiveFormsModule,CommonModule,MatSelectModule],
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.scss'
})
export class CategoryDialogComponent {
public categoryForm!: FormGroup;
categoryTypes: CategoryType[] = ['income', 'expense', 'investment'];
constructor(public dialogRef: MatDialogRef<CategoryDialogComponent>,@Inject(MAT_DIALOG_DATA )public data:Category, private fb: FormBuilder) {
 this.initializeForm();
}
initializeForm():void{
  const initialType = this.data?.type && this.categoryTypes.includes(this.data.type)
                        ? this.data.type
                        : null; // Default to null if data.type is missing or invalid
  this.categoryForm= this.fb.group({
    name:[this.data.name|| '', Validators.required],
    type: [initialType||'', Validators.required],
    // parentCategory:[data.parentCategoryId],
    // icon:[data.icon || '']
  })
}
onNoClick():void{
  this.dialogRef.close();
}
}
