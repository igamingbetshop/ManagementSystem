import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule, Routes } from '@angular/router';
import { DropdownDirective } from 'src/app/core/directives/dropdown.directive';
import { CompetitionsComponent } from './competitions.component';


const routes: Routes = [
  {
    path: '',
    component: CompetitionsComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatCheckboxModule,
    AgGridModule,
    MatSelectModule,
    TranslateModule,
    MatButtonModule,
    DropdownDirective,
    MatMenuModule,
    RouterModule.forChild(routes),
  ],
  declarations: [CompetitionsComponent]
})
export class CompetitionsModule { }
