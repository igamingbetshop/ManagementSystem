import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrenciesComponent } from './currencies.component';
import { CurrenciesRoutingModule } from './currencies-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import {TranslateModule} from "@ngx-translate/core";
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  imports: [
    CommonModule,
    CurrenciesRoutingModule,
    MatSelectModule,
    AgGridModule,
    TranslateModule
  ],
  declarations: [CurrenciesComponent]
})
export class CurrenciesModule { }
