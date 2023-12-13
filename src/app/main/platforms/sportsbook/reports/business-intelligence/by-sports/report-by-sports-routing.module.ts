import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { ReportBySportsComponent } from './report-by-sports.component';
import { SportFilterOptionsResolver } from '../../../resolvers/sport-filter-options.resolver';


const routes: Routes = [
  {
    path:'',
    component: ReportBySportsComponent,
    resolve: { filterData: SportFilterOptionsResolver },
    children:[
      {
        path: 'sports',
        loadChildren: () => import('./sports-report/sports-report.module').then(m => m.SportsReportModule),
      },
      {
        path: 'regions',
        loadChildren: () => import('./by-regions/by-regions.module').then(m => m.ByRegionsModule),
      },
      {
        path: 'competitions',
        loadChildren: () => import('./by-competitions/by-competitions.module').then(m => m.ByCompetitionsModule),
      },
      {
        path: '',
        redirectTo: 'sports',
        pathMatch:'full'
      }
    ]
  }

];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportBySportsRoutingModule {

}
