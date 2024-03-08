import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainProviderComponent } from './main-povider.component';
import { RouterModule, Routes } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatGridListModule} from "@angular/material/grid-list";
import {AgGridModule} from "ag-grid-angular";
import {TranslateModule} from "@ngx-translate/core";
import { MatCheckboxModule } from '@angular/material/checkbox';

const routes: Routes = [
  {
    path: '',
    component: MainProviderComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    MatGridListModule,
    AgGridModule,
    TranslateModule,
    MatCheckboxModule,
    FormsModule
  ],
  declarations: [MainProviderComponent]
})
export class MainProviderModule { }
