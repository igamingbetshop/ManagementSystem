import {NgModule} from "@angular/core";
import {SettingsComponent} from "./settings.component";
import {CommonModule} from "@angular/common";
import {SettingsRoutingModule} from "./settings-routing.module";
import {CoreApiService} from "../core/services/core-api.service";

@NgModule({
  declarations: [SettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
  ],
  providers: [
    CoreApiService
  ]
})
export class SettingsModule {

}
