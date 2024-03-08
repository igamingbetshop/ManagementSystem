import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslationsComponent} from "./translations.component";
import {TranslationsRoutingModule} from "./translations-routing.module";
import {AgGridModule} from "ag-grid-angular";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";

import {TranslateModule} from "@ngx-translate/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";

import {MatInputModule} from "@angular/material/input";


@NgModule({

  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslationsRoutingModule,
    MatDialogModule,
    MatButtonModule,
    TranslateModule,
    AgGridModule,
    MatSelectModule,
    MatInputModule,
    FormsModule
  ],
  declarations: [TranslationsComponent],
})
export class TranslationsModule {

}
