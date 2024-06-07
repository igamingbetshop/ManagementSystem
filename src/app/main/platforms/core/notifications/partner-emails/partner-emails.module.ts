import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { PartnerEmailsComponent } from './partner-emails.component';
import { PartnerDateFilterComponent } from "../../../../components/partner-date-filter/partner-date-filter.component";


const routes: Routes = [
  {
    path: '',
    component: PartnerEmailsComponent
  }
];

@NgModule({
  declarations: [PartnerEmailsComponent],
  providers: [DatePipe],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    MatCheckboxModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AgGridModule,
    RouterModule.forChild(routes),
    MatIconModule,
    PartnerDateFilterComponent
  ]
})
export class PartnerEmailsModule { }
