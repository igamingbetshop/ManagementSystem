import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { AgGridModule } from "ag-grid-angular";
import { TranslateModule } from "@ngx-translate/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from '@angular/material/select';

import { TeasersComponent } from './teasers.component';
import { TeasersRoutingModule } from "./teasers-routing.module";
import { MatButtonModule } from '@angular/material/button';
import { SelectedTeaserGridComponent } from './selected-teaser/selected-teaser-grid.component';


@NgModule({
  declarations: [
    TeasersComponent
  ],
  imports: [
    CommonModule,
    TeasersRoutingModule,
    AgGridModule,
    TranslateModule,
    FormsModule,
    MatSelectModule,
    MatDialogModule,
    TranslateModule,
    MatButtonModule,
    SelectedTeaserGridComponent
  ]
})
export class TeasersModule { }
