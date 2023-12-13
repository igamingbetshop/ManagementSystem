import { NgModule } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from "@angular-material-components/datetime-picker";
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ByPlayersComponent } from './by-players.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';



const routes: Routes = [
  {
    path: '',
    component: ByPlayersComponent,

  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    MatNativeDateModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    AgGridModule,
    TranslateModule,
    MatButtonModule,
    MatInputModule
  ],
  declarations: [ByPlayersComponent],
  providers: [DatePipe, DecimalPipe],
})
export class ByPlayersModule { }
