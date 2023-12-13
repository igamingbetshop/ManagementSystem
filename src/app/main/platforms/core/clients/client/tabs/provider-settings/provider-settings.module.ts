import {RouterModule, Routes} from "@angular/router";
import {ProviderSettingsComponent} from "./provider-settings.component";
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {AgGridModule} from "ag-grid-angular";
import {TranslateModule} from "@ngx-translate/core";

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
      TranslateModule
    ]
})
export class ProviderSettingsModule {

}
