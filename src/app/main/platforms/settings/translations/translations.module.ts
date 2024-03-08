import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslationsComponent,} from './translations.component';
import {MatButtonModule} from "@angular/material/button";

import {MatDialogModule} from "@angular/material/dialog";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {AddEditTranslationComponent} from "./add-edit-translation/add-edit-translation.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatInputModule} from "@angular/material/input";

import {MatSelectModule} from "@angular/material/select";

import {MatCheckboxModule} from "@angular/material/checkbox";
import {TranslateModule} from "@ngx-translate/core";
import {MatIconModule} from "@angular/material/icon";
import {AddEditTranslationItemComponent} from "./add-edit-translation-item/add-edit-translation-item.component";
import {AddEditLanguagesComponent} from "./add-edit-languages/add-edit-languages.component";

const routes: Routes = [
  {
    path: '',
    component: TranslationsComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild(routes),
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    TranslateModule
  ],
  declarations: [
    TranslationsComponent,
    AddEditTranslationComponent,
    AddEditTranslationItemComponent,
    AddEditLanguagesComponent
  ]
})
export class TranslationsModule {
}
