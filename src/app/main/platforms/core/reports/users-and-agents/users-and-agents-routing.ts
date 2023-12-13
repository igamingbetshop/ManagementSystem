import {RouterModule, Routes} from "@angular/router";
import {FilterOptionsResolver} from "../../resolvers/filter-options.resolver";
import {NgModule} from "@angular/core";
import {UsersAndAgentsComponent} from "./users-and-agents.component";

const routes: Routes = [

  {
    path: '',
    component: UsersAndAgentsComponent,
    children: [
      {
        path: 'report-by-user-transactions',
        loadChildren: () => import('./report-by-user-transactions/report-by-user-transactions.module').then(m => m.ReportByUserTransactionsModule),
        resolve: {filterData: FilterOptionsResolver},
      },
      {
        path: 'report-by-agent-transfers',
        loadChildren: () => import('./report-by-agent-transfers/report-by-agent-transfers.module').then(m => m.ReportByAgentTransfersModule),
        resolve: {filterData: FilterOptionsResolver},
      },

    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersAndAgentsRouting {

}
