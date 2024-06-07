import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TranslateModule} from "@ngx-translate/core";
import {AgBooleanFilterModule} from "../../../../components/grid-common/ag-boolean-filter/ag-boolean-filter.module";
import {AgGridModule} from "ag-grid-angular";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatInputModule} from "@angular/material/input";

import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";

import {ActiveTournamentsRoutingModule} from "./active-tournaments-routing.module";
import {ActiveTournamentsComponent} from "./active-tournaments.component";
import {ActiveTournamentComponent} from "./active-tournament/active-tournament.component";
import {AddTournamentComponent} from "./add-tournament/add-tournament.component";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {AddEditSkillTranslationModule} from "./add-edit-translation/add-edit-translation.component";
import { DateTimePickerComponent } from "src/app/main/components/data-time-picker/data-time-picker.component";


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    AgBooleanFilterModule,
    AgGridModule,
    MatSnackBarModule,
    ActiveTournamentsRoutingModule,
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
    AddEditSkillTranslationModule,
    DateTimePickerComponent
  ],
  declarations: [ActiveTournamentsComponent, ActiveTournamentComponent, AddTournamentComponent]
})
export class ActiveTournamentsModule {
}
