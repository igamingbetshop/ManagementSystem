import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MainComponent } from './main.component';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AgGridModule } from "ag-grid-angular";
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from "@ngx-translate/core";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { DateTimePickerComponent } from 'src/app/main/components/data-time-picker/data-time-picker.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    AgGridModule,
    MatNativeDateModule,
    MatDatepickerModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatSlideToggleModule,
    DateTimePickerComponent
  ],
  declarations: [MainComponent],
  providers: [DatePipe],
})
export class MainModule { }
