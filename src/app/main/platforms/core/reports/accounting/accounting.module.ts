import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AccountingComponent} from "./accounting.component";
import {AccountingRoutingModule} from "./accounting-routing.module";

@NgModule({
  imports: [
    CommonModule,
    AccountingRoutingModule
  ],
  declarations: [AccountingComponent]
})
export class AccountingModule {
}
