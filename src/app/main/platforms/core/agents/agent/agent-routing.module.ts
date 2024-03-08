import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AgentComponent} from "./agent.component";

const routes: Routes = [
  {
    path: '',
    component: AgentComponent,
    children: [
      {
        path: 'main',
        loadChildren: () => import('./tabs/main/main.module').then(m => m.MainModule),
      },
      {
        path: 'downline',
        loadChildren: () => import('./tabs/downline/downline.module').then(m => m.DownlineModule),
      },
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class AgentRoutingModule {

}
