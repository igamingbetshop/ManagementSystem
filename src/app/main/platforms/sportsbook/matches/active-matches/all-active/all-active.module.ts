import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AllActiveComponent } from './all-active.component';
import { AllActiveRoutingModule } from './all-active-routing.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    AllActiveRoutingModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSnackBarModule,
    TranslateModule,
    AgGridModule,
  ],
  declarations: [AllActiveComponent],
  providers: [DatePipe],
})
export class AllActiveModule { }
