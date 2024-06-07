import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { TranslateModule } from "@ngx-translate/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatRadioModule } from '@angular/material/radio';

import { MainComponent } from "./main.component";

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  }
]
@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSnackBarModule,
    FormsModule,
    MatRadioModule,
    RouterModule.forChild(routes),
    TranslateModule,
    MatDialogModule,
  ],
})

export class MainModule {

}
