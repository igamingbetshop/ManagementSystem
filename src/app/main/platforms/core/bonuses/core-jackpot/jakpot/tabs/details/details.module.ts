import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { DetailsComponent } from './details.component';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from "ag-grid-angular";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

import { MatInputModule } from "@angular/material/input";

import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule } from "@angular/material/select";
import { MatChipsModule } from '@angular/material/chips';

import { MatDialogModule } from '@angular/material/dialog';
import { DateTimePickerComponent } from 'src/app/main/components/data-time-picker/data-time-picker.component';

const routes: Routes = [
  {
    path: '',
    component: DetailsComponent
  },
];

@NgModule({
    declarations: [DetailsComponent],
    providers: [DatePipe],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        AgGridModule,
        MatSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatInputModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule,
        TranslateModule,
        MatSelectModule,
        MatDialogModule,
        MatChipsModule,
        DateTimePickerComponent
    ]
})
export class DetailsModule {
}
