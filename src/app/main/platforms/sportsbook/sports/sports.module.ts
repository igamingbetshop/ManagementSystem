import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AgGridModule } from 'ag-grid-angular';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';

import { SportsComponent } from './sports.component';
import { SportsRoutingModule } from "./sports-routing.module";
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SportsRoutingModule,
    MatSelectModule,
    AgGridModule,
    MatButtonModule,
    TranslateModule
  ],
  declarations: [
    SportsComponent,
  ],
  providers: [

  ]
})
export class SportsModule { }
