import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketTypeMainComponent } from './market-type-main.component';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {TranslateModule} from "@ngx-translate/core";
import {MatCheckboxModule} from "@angular/material/checkbox";
import { AgGridModule } from 'ag-grid-angular';

const routes: Routes = [
  {
    path: '',
    component: MarketTypeMainComponent
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
    MatCheckboxModule,
    MatInputModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    AgGridModule
  ],
  declarations: [MarketTypeMainComponent]
})
export class MarketTypeMainModule { }
