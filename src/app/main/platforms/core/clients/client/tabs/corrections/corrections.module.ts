import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CorrectionsComponent } from "./corrections.component";
import { RouterModule, Routes } from "@angular/router";
import { AgGridModule } from "ag-grid-angular";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatButtonModule } from "@angular/material/button";

import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { CorrectionModalComponent } from './correction-modal/correction-modal.component';
import { MatSelectModule } from "@angular/material/select";

import { TranslateModule } from "@ngx-translate/core";
import { MatIconModule } from "@angular/material/icon";
import { PartnerDateFilterComponent } from "../../../../../../components/partner-date-filter/partner-date-filter.component";

const routes: Routes = [
  {
    path: '',
    component: CorrectionsComponent
  }
];

@NgModule({
  declarations: [CorrectionsComponent, CorrectionModalComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
    TranslateModule,
    MatIconModule,
    PartnerDateFilterComponent
  ]
})
export class CorrectionsModule {

}
