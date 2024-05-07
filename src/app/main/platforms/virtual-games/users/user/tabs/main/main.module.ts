import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatSnackBarModule } from "@angular/material/snack-bar";

import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";

import { MatSelectModule } from "@angular/material/select";

import { MatInputModule } from "@angular/material/input";

import { MatButtonModule } from "@angular/material/button";

import { MatGridListModule } from "@angular/material/grid-list";
import { AgGridModule } from "ag-grid-angular";
import { MainComponent } from "./main.component";
import { TranslateModule } from "@ngx-translate/core";


const routes: Routes = [
  {
    path: '',
    component: MainComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    RouterModule.forChild(routes),
    MatGridListModule,
    AgGridModule,
    TranslateModule
  ],
  declarations: [MainComponent]
})

export class MainModule {
}
