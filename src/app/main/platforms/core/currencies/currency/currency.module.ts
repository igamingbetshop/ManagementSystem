import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CurrencyComponent} from './currency.component';
import { RouterModule, Routes } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { AgGridModule } from 'ag-grid-angular';

const routes: Routes = [
  {
    path: '',
    component: CurrencyComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,

    MatButtonModule,
    RouterModule.forChild(routes),
    AgGridModule,
  ],
  declarations: [CurrencyComponent],
  providers: [DatePipe],
})
export class CurrencyModule { }
