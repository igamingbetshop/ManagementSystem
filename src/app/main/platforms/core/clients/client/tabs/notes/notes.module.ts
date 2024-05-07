import {RouterModule, Routes} from "@angular/router";
import {NotesComponent} from "./notes.component";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AgGridModule} from "ag-grid-angular";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

import {MatInputModule} from "@angular/material/input";

import {NoteComponent} from './note/note.component';
import {MatIconModule} from "@angular/material/icon";
import {TranslateModule} from "@ngx-translate/core";
import { PartnerDateFilterComponent } from "../../../../../../components/partner-date-filter/partner-date-filter.component";
import { MatSelectModule } from "@angular/material/select";

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
        MatFormFieldModule,
        MatDialogModule,
        MatButtonModule,
        MatInputModule,
        MatSelectModule,
        FormsModule,
        MatIconModule,
        TranslateModule,
        PartnerDateFilterComponent
    ]
})
export class NotesModule {

}
