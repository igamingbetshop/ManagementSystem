import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TranslateModule } from "@ngx-translate/core";
import { AgBooleanFilterModule } from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.module";
import { AgGridModule } from "ag-grid-angular";
import { OpenerComponent } from "../../../../components/grid-common/opener/opener.component";
import { AgBooleanFilterComponent } from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatInputModule } from "@angular/material/input";

import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";

import { FinishedTournamentsRoutingModule } from "./finished-tournaments-routing.module";
import { FinishedTournamentsComponent } from "./finished-tournaments.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { FinishedTournamentComponent } from "./finished-tournament/finished-tournament.component";

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    AgBooleanFilterModule,
    AgGridModule,
    MatSnackBarModule,
    FinishedTournamentsRoutingModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  declarations: [FinishedTournamentsComponent, FinishedTournamentComponent]
})
export class FinishedTournamentsModule {
}
