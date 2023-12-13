import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductEditComponent } from './product-edit.component';
import { RouterModule, Routes } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AgGridModule } from 'ag-grid-angular';


const routes: Routes = [
  {
    path: '',
    component: ProductEditComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatTooltipModule,
    MatIconModule,
    TranslateModule,
    AgGridModule,
    MatButtonModule,
    MatCheckboxModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ProductEditComponent]
})
export class ProductEditModule { }
