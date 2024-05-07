import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DashboardComponent} from "./dashboard.component";

const routes: Routes = [
  {
    path: '',
    component:DashboardComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./main-dashboard/main-dashboard.component').then(m => m.MainDashboardComponent)
      },
      {
        path: 'country-analytics',
        loadComponent: () => import('./country-analytics/country-analytics.component').then(m => m.CountryAnalyticsComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule
{

}
