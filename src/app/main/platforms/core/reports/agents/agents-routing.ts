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
        path: 'report-by-agent-transfers',
        loadChildren: () => import('../users-and-agents/report-by-agent-transfers/report-by-agent-transfers.module').then(m => m.ReportByAgentTransfersModule),
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
