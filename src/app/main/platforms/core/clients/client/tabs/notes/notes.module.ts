import {RouterModule, Routes} from "@angular/router";
import {NotesComponent} from "./notes.component";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AgGridModule} from "ag-grid-angular";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatDialogModule} from "@angular/material/dialog";
import {MatNativeDateModule} from "@angular/material/core";
import {MatButtonModule} from "@angular/material/button";

import {MatInputModule} from "@angular/material/input";

import {NoteComponent} from './note/note.component';
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";
import { PartnerDateFilterComponent } from "../../../../../../components/partner-date-filter/partner-date-filter.component";

const routes: Routes = [
  {
    path: '',
    component: NotesComponent
  }
];

@NgModule({
    declarations: [NotesComponent, NoteComponent],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        AgGridModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatFormFieldModule,
        MatDialogModule,
        MatButtonModule,
        MatInputModule,
        FormsModule,
        MatIconModule,
        TranslateModule,
        NgxMatDatetimePickerModule,
        NgxMatNativeDateModule,
        PartnerDateFilterComponent
    ]
})
export class NotesModule {

}
