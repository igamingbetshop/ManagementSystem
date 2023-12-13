import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {FinishedCashTablesComponent} from "./finished-cash-tables.component";
import {FinishedCashTableComponent} from "./finished-cash-table/finished-cash-table.component";

const routes: Routes = [
  {
    path: '',
    component: FinishedCashTablesComponent
  },
  {
    path: ':id',
    component: FinishedCashTableComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})


export class FinishedCashTablesRoutingModule {
}
