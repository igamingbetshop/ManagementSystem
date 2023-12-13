import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AccountingComponent} from "./accounting.component";
import {FilterOptionsResolver} from "../../resolvers/filter-options.resolver";

const routes: Routes = [

  {
    path: '',
    component: AccountingComponent,
    children: [
      {
        path: 'report-by-deposit',
        loadChildren: () => import('./report-by-deposit/report-by-deposit.module').then(m => m.ReportByDepositModule),
        resolve: {filterData: FilterOptionsResolver},
      },
      {
        path: 'report-by-withdrawal',
        loadChildren: () => import('./report-by-withdrawal/report-by-withdrawal.module').then(m => m.ReportByWithdrawalModule),
        resolve: {filterData: FilterOptionsResolver},
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountingRoutingModule {

}
