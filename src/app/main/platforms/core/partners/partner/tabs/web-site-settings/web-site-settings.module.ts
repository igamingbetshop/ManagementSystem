import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {WebSiteSettingsComponent} from "./web-site-settings.component";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatInputModule} from "@angular/material/input";

import {MatButtonModule} from "@angular/material/button";

import {CopyWebsiteSettingsComponent} from './copy-website-settings/copy-website-settings.component';
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";

import {AddEditMenuComponent} from './add-edit-menu/add-edit-menu.component';
import {MatCheckboxModule} from "@angular/material/checkbox";
import {AddEditSubMenuComponent} from './add-edit-sub-menu/add-edit-sub-menu.component';
import {AddEditTranslationsComponent} from './add-edit-translations/add-edit-translations.component';
import {AddEditMenuItemComponent} from './add-edit-menu-item/add-edit-menu-item.component';
import {TranslateModule} from "@ngx-translate/core";
import {ColorPickerModule} from "ngx-color-picker";
import {HtmlEditorModule} from "../../../../../../components/html-editor/html-editor.component";

const routes: Routes = [
  {
    path: '',
    component: WebSiteSettingsComponent,
  }
]

@NgModule({
  declarations: [
    WebSiteSettingsComponent,
    CopyWebsiteSettingsComponent,
    AddEditMenuComponent,
    AddEditMenuItemComponent,
    AddEditSubMenuComponent,
    AddEditTranslationsComponent

  ],
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
    TranslateModule,
    ColorPickerModule,
    HtmlEditorModule
  ]
})

export class WebSiteSettingsModule {

}
