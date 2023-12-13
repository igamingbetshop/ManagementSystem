import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import {AgGridModule} from "ag-grid-angular";
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ClientCategoriesComponent } from './client-categories.component';
import { ClientCategoriesRoutingModule } from './client-categories-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import {TranslateModule} from "@ngx-translate/core";



@NgModule({
  declarations: [ClientCategoriesComponent],
  imports: [
    CommonModule,
    ClientCategoriesRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    TranslateModule,
    AgGridModule
  ]

})
export class ClientCategoriesModule { }
