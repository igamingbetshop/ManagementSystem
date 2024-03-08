import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MainRoutingModule} from './main-routing.module';
import {MainComponent} from './components/main/main.component';
import {HeaderComponent} from './components/header/header.component';
import {LeftMenuComponent} from './components/left-menu/left-menu.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";

import {MatButtonModule} from "@angular/material/button";

import {MatInputModule} from "@angular/material/input";

import {MatFormFieldModule} from "@angular/material/form-field";

import {MatListModule} from "@angular/material/list";
import {MatMenuModule} from "@angular/material/menu";
import {MatExpansionModule} from '@angular/material/expansion';
import {FormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {LeftMenuItemsComponent,} from "./components/left-menu/left-menu-items/left-menu-items.component";


@NgModule({
  declarations: [
    MainComponent,
    HeaderComponent,
    LeftMenuComponent,
    LeftMenuItemsComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatExpansionModule,
    FormsModule,
    TranslateModule,

  ]
})
export class MainModule {

}
