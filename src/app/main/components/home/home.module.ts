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
import { QuickFindComponent } from "../quick-find/quick-find.component";
import { ApiService } from 'src/app/core/services';
import { CoreApiService } from '../../platforms/core/services/core-api.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  }
];

@NgModule({
    declarations: [HomeComponent, CategoryComponent],
    imports: [
        CommonModule,
        MatSelectModule,
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        TranslateModule,
        RouterModule.forChild(routes),
        QuickFindComponent
    ],
    providers: [
      ApiService,
      CoreApiService,

    ]
})

export class HomeModule { }
