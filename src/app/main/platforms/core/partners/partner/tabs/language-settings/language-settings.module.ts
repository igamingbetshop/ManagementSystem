import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSnackBarModule} from "@angular/material/snack-bar";

import {LanguageSettingsComponent} from "./language-settings.component";
import {MatGridListModule} from "@angular/material/grid-list";
import {AgGridModule} from "ag-grid-angular";
import {MatFormFieldModule} from "@angular/material/form-field";

import {MatSelectModule} from "@angular/material/select";

import {TranslateModule} from "@ngx-translate/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { PartnerLanguageSettingsComponent } from "./grids/partner-languages/partner-language-settings.component";
import { AllLanguageSettingsComponent } from "./grids/all-languages/all-language-settings.component";

const routes: Routes = [
  {
    path: '',
    component: LanguageSettingsComponent,
  }
]

@NgModule({
  declarations: [LanguageSettingsComponent, AllLanguageSettingsComponent, PartnerLanguageSettingsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    MatSnackBarModule,
    MatGridListModule,
    AgGridModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
  ]
})

export class LanguageSettingsModule {

}
