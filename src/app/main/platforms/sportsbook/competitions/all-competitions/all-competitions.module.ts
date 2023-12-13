import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllCompetitionsComponent } from './all-competitions.component';
import { AllCompetitionsRoutingModule } from './all-competitions-categories-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {DropdownDirective} from "../../../../../core/directives/dropdown.directive";
import {MatMenuModule} from "@angular/material/menu";
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AllCompetitionsRoutingModule,
    MatDialogModule,
    MatCheckboxModule,
    AgGridModule,
    MatSelectModule,
    TranslateModule,
    MatButtonModule,
    DropdownDirective, MatMenuModule
  ],
  declarations: [AllCompetitionsComponent]
})
export class AllCompetitionsModule { }
