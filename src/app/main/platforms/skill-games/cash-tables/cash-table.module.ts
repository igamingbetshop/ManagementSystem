import {NgModule} from "@angular/core";
import {CashTableComponent} from "./cash-table.component";
import {CommonModule} from "@angular/common";
import {CashTableRoutingModule} from "./cash-table-routing.module";

@NgModule({
  imports: [
    CommonModule,
    CashTableRoutingModule
  ],
  declarations: [CashTableComponent],
  providers: []
})

export class CashTableModule {
}
