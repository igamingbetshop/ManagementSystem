import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AgGridModule } from 'ag-grid-angular';
import {TranslateModule} from "@ngx-translate/core";
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

import { TranslationsComponent } from './translations.component';
import { TranslationsRoutingModule } from './translations-routing.module';

const routes: Routes = [
  {
    path: '',
    component: TranslationsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    TranslationsRoutingModule,
    TranslateModule,
    AgGridModule,
    MatSelectModule,
    MatInputModule,
    FormsModule
  ],
  declarations: [TranslationsComponent]
})
export class SportsbookTranslationsModule { }
