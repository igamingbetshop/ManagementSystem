import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {DashboardComponent} from "./dashboard.component";
import {SportFilterOptionsResolver} from "../resolvers/sport-filter-options.resolver";

const routes: Routes = [
  {
    path: '',
    component:DashboardComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./match-analytics/match-analytics.component').then(m => m.MatchAnalyticsComponent)
      },
      {
        path: 'match-analytics',
        loadComponent: () => import('./match-analytics/match-analytics.component').then(m => m.MatchAnalyticsComponent)
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
