import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BetshopsComponent} from "./betshops.component";
import {BetshopsRoutingModule} from "./betshops-routing.module";

@NgModule({
  imports: [
    CommonModule,
    BetshopsRoutingModule
  ],
  declarations: [BetshopsComponent]
})
export class BetshopsModule {
}
