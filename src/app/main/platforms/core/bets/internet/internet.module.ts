import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InternetComponent } from './internet.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { OddsTypePipe } from "../../../../../core/pipes/odds-type.pipe";
import { SettleBetModalComponent } from "./settle-bet-modal/settle-bet-modal.component";
import { PartnerDateFilterComponent } from "../../../../components/partner-date-filter/partner-date-filter.component";

const routes: Routes = [
  {
    path: '',
    component: InternetComponent
  }
];

@NgModule({
  declarations: [InternetComponent],
  providers: [DatePipe, OddsTypePipe],
  imports: [
    CommonModule,
    FormsModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    AgGridModule,
    RouterModule.forChild(routes),
    SettleBetModalComponent,
    PartnerDateFilterComponent
  ]
})
export class InternetModule { }
