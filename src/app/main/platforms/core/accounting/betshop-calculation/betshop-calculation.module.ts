import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BetshopCalculationComponent } from './betshop-calculation.component';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';
import { FormsModule} from '@angular/forms';
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: BetshopCalculationComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    AgGridModule,
    TranslateModule
  ],
  declarations: [BetshopCalculationComponent],
  providers: [DatePipe],
})
export class BetshopCalculationModule { }
