import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllCompetitionsCategoriesComponent } from './all-competitions-categories.component';
import { AllCompetitionsCategoriesRoutingModule } from './all-competitions-categories-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AllCompetitionsCategoriesRoutingModule,
    MatSelectModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
    AgGridModule

  ],
  declarations: [AllCompetitionsCategoriesComponent]
})
export class AllCompetitionsCategoriesModule { }
