import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { AgGridModule } from "ag-grid-angular";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { CountrySettingsComponent } from "./country-settings.component";
import { MatSelectModule } from "@angular/material/select";


const routes: Routes = [
  {
    path: '',
    component: CountrySettingsComponent
  }
];

@NgModule({
  declarations: [CountrySettingsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    AgGridModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,

  ]
})
export class CountrySettingsModule { }
