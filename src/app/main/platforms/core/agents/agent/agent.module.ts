import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatTabsModule} from "@angular/material/tabs";
import {NgxMatDatetimePickerModule, NgxMatNativeDateModule} from "@angular-material-components/datetime-picker";
import {TranslateModule} from "@ngx-translate/core";
import {AgentComponent} from "./agent.component";
import {AgentRoutingModule} from "./agent-routing.module";
import {RouterModule} from "@angular/router";


@NgModule({
  imports: [
    CommonModule,
    AgentRoutingModule,
    MatTabsModule,
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    TranslateModule,
    RouterModule
  ],
  declarations: [AgentComponent]
})

export class AgentModule {

}
