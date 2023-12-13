import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ActiveCashTablesComponent} from "./active-cash-tables.component";
import {ActiveCashTableComponent} from "./active-cash-table/active-cash-table.component";

const routes: Routes = [
  {
    path: '',
    component: ActiveCashTablesComponent
  },
  {
    path: ':id',
    component: ActiveCashTableComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})


export class CashTablesRoutingModule {
}
