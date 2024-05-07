import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebSiteSettingsComponent } from './web-site-settings.component';
import { RouterModule, Routes } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule} from "@angular/material/dialog";
import { AddEditTranslationsComponent } from './add-edit-translations/add-edit-translations.component';
import { AddEditMenuComponent } from './add-edit-menu/add-edit-menu.component';
import { AddEditSubMenuComponent } from './add-edit-sub-menu/add-edit-sub-menu.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
  {
    path: '',
    component: WebSiteSettingsComponent,

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
        MatDialogModule,
        FormsModule,
        RouterModule.forChild(routes),
        MatCheckboxModule,
        TranslateModule
    ],
  declarations: [WebSiteSettingsComponent, AddEditTranslationsComponent, AddEditMenuComponent, AddEditSubMenuComponent]
})
export class WebSiteSettingsModule { }
