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
        path: 'commission-plan',
        loadChildren: () => import('./tabs/commission-plan/commision-plan.module').then(m => m.CommissionPlanModule),
      },
      {
        path: 'user-settings',
        loadChildren: () => import('./tabs/user-settings/user-settings.module').then(m => m.UserSettingsModule),
      },
      {
        path: 'employees',
        loadChildren: () => import('./tabs/employees/employees.module').then(m => m.EmployeesModule),
      },
      {
        path: 'corrections',
        loadChildren: () => import('./tabs/corrections/corrections.module').then(m => m.CorrectionsModule),
      },
      {
        path: 'clients',
        loadChildren: () => import('./tabs/clients/clients.module').then(m => m.ClientsModule),
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
