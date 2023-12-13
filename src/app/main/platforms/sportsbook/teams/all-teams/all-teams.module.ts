import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from "@angular/material/select";
import { TranslateModule } from "@ngx-translate/core";
import { AllTeamsComponent } from './all-teams.component';
import { AllTeamsRoutingModule } from './all-teams-routing.module';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  imports: [
    CommonModule,
    AllTeamsRoutingModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    MatSelectModule,
    AgGridModule,
    TranslateModule,
    MatButtonModule
  ],
  declarations: [AllTeamsComponent]
})
export class AllTeamsModule { }
