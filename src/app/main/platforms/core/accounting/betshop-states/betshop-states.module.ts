import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BetshopStatesComponent } from './betshop-states.component';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: BetshopStatesComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    AgGridModule,
    FormsModule,
    TranslateModule
  ],
  declarations: [BetshopStatesComponent],
  providers: [DatePipe],
})
export class BetshopStatesModule { }
