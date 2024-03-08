import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {AgentsComponent} from "./agents.component";
import {FilterOptionsResolver} from "../resolvers/filter-options.resolver";

const routes: Routes = [
  {
    path: '',
    component: AgentsComponent,
    children: [
      {
        path: 'agent',
        loadChildren: () => import('./agent/agent.module').then(m => m.AgentModule)
      },
      {
        path: 'all-agents',
        loadChildren: () => import('./all-agents/all-agents.module').then(m => m.AllAgentsModule),
        resolve:{filterData:FilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'all-agents',
        pathMatch:'full'
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgentsRoutingModule {

}
