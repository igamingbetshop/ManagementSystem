import { RouterModule, Routes } from "@angular/router";
import { FilterOptionsResolver } from "../../resolvers/filter-options.resolver";
import { NgModule } from "@angular/core";
import { AgentsComponent } from "./agents.component";

const routes: Routes = [
  {
    path: '',
    component: AgentsComponent,
    children: [
      {
        path: 'report-by-agent-transactions',
        loadChildren: () => import('./report-by-agent-transactions/report-by-agent-transactions.module').then(m => m.ReportByAgentTransactionsModule),
        resolve: { filterData: FilterOptionsResolver },
      },
      {
        path: 'report-by-agents',
        loadChildren: () => import('./report-by-agents/report-by-agents.module').then(m => m.ReportByAgentsModule),
        resolve: { filterData: FilterOptionsResolver },
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgentsRouting {

}
