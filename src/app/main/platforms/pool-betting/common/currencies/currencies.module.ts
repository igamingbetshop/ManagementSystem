import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PBCurrenciesComponent } from './currencies.component';
import { CurrenciesRoutingModule } from './currencies-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { TranslateModule } from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [
    CommonModule,
    CurrenciesRoutingModule,
    MatSelectModule,
    AgGridModule,
    TranslateModule,
    MatSnackBarModule
  ],
  declarations: [PBCurrenciesComponent]
})
export class CurrenciesModule { }
