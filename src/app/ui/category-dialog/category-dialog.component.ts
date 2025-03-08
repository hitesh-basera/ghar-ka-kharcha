import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../../shared/interfaces/category.model';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule, FormsModule,ReactiveFormsModule],
  templateUrl: './category-dialog.component.html',
  styleUrl: './category-dialog.component.scss'
})
export class CategoryDialogComponent {
public categoryForm: FormGroup;

constructor(public dialogRef: MatDialogRef<CategoryDialogComponent>,@Inject(MAT_DIALOG_DATA )public data:Category, private fb: FormBuilder) {
  this.categoryForm= this.fb.group({
    name:[data.name|| '', Validators.required],
    icon:[data.icon || '']
  })
  
}
onNoClick():void{
  this.dialogRef.close();
}
}
