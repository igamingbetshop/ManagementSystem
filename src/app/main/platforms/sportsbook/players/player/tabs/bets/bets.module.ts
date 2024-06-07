import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BetsComponent } from './bets.component';
import { Routes, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AgGridModule } from "ag-grid-angular";
import { TranslateModule } from "@ngx-translate/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { OddsTypePipe } from "../../../../../../../core/pipes/odds-type.pipe";
import { PartnerDateFilterComponent } from "../../../../../../components/partner-date-filter/partner-date-filter.component";

const routes: Routes = [
  {
    path: '',
    component: BetsComponent
  }
];

@NgModule({
  declarations: [BetsComponent],
  providers: [OddsTypePipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    TranslateModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    PartnerDateFilterComponent
  ]
})
export class BetsModule { }
