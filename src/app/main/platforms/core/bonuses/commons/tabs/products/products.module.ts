import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { RouterModule, Routes } from '@angular/router';
import {AgGridModule} from "ag-grid-angular";
import {TranslateModule} from "@ngx-translate/core";
import { FormsModule } from '@angular/forms';

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
    TranslateModule,
    FormsModule
  ],
  declarations: [ProductsComponent]
})
export class ProductsModule { }
