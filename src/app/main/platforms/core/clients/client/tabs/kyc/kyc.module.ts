import {RouterModule, Routes} from "@angular/router";
import {KycComponent} from "./kyc.component";
import {NgModule} from "@angular/core";
import {CommonModule, DatePipe} from "@angular/common";
import {AgGridModule} from "ag-grid-angular";
import {MatButtonModule} from "@angular/material/button";

import {MatSelectModule} from "@angular/material/select";

import {ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {CreateNewDocumentComponent} from './create-new-document/create-new-document.component';
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";

import {ViewImageComponent} from './view-image/view-image.component';
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: KycComponent
  }
];

@NgModule({
  declarations: [KycComponent, CreateNewDocumentComponent, ViewImageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    TranslateModule
  ],
  providers: [DatePipe]
})

export class KycModule {

}
