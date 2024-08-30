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
      },
      {
        path: 'payment-analytics',
        loadComponent: () => import('./payment-analytics/payment-analytics.component').then(m => m.PaymentAnalyticsComponent)
      },
      {
        path: 'client-analytics',
        loadComponent: () => import('./client-analytics/client-analytics.component').then(m => m.ClientAnalyticsComponent)
      },
      {
        path: 'agent-analytics',
        loadComponent: () => import('./agent-analytics/agent-analytics.component').then(m => m.AgentAnalyticsComponent)
      },
      {
        path: 'partner-analytics',
        loadComponent: () => import('./partners-analytics/partners-analytics.component').then(m => m.PartnersAnalyticsComponent)
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
