import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AllFinishedComponent } from './all-finished.component';
import { AllFinishedRoutingModule } from './all-finished-routing.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";
import {MatInputModule} from "@angular/material/input";

@NgModule({
  imports: [
    CommonModule,
    AllFinishedRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSnackBarModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    AgGridModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule
  ],
  declarations: [AllFinishedComponent],
  providers: [DatePipe],
})
export class AllFinishedModule { }
