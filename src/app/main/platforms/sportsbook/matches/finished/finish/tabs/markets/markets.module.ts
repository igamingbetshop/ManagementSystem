import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import { MarketsComponent } from './markets.component';
import { RouterModule, Routes } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { AgGridModule } from 'ag-grid-angular';
import {TranslateModule} from "@ngx-translate/core";
import {OddsTypePipe} from "../../../../../../../../core/pipes/odds-type.pipe";

const routes: Routes = [
  {
    path: '',
    component: MarketsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatSnackBarModule,
    FormsModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    TranslateModule
  ],
  declarations: [MarketsComponent],
  providers: [OddsTypePipe],
})
export class MarketsModule { }
