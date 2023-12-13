import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./home.component";
import {MatSelectModule} from "@angular/material/select";
import {MatButtonModule} from "@angular/material/button";
import {TranslateModule} from "@ngx-translate/core";
import {MatMenuModule} from "@angular/material/menu";
import {MatIconModule} from "@angular/material/icon";
import {CategoryComponent} from "./category/category.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatSelectModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    TranslateModule,
    RouterModule.forChild(routes),
  ],
  declarations: [HomeComponent, CategoryComponent]
})

export class HomeModule { }
