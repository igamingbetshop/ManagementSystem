import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {TranslateModule} from "@ngx-translate/core";
import {AgGridModule} from "ag-grid-angular";
import {ProviderSettingsComponent} from "./provider-settings.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";


const routes: Routes = [
  {
    path: '',
    component: ProviderSettingsComponent
  }
];

@NgModule({
  declarations: [ProviderSettingsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    AgGridModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule

  ]
})
export class ProviderSettingsModule {}
