import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AgGridModule } from 'ag-grid-angular';
import { TranslateModule } from "@ngx-translate/core";

import { ProductsComponent } from "./products.component";

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AgGridModule,
    TranslateModule
  ],
  declarations: [ProductsComponent]
})
export class ProductsModule { }
