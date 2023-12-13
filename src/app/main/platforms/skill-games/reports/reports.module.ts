import {NgModule} from "@angular/core";
import {ReportsComponent} from "./reports.component";
import {CommonModule} from "@angular/common";
import {ReportsRoutingModule} from "./reports-routing.module";

@NgModule({
  imports: [
    CommonModule,
    ReportsRoutingModule
  ],
  declarations: [ReportsComponent],
  providers: []
})

export class ReportsModule {
}
