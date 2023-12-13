import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ReportsComponent} from "./reports.component";
import {VirtualGamesFilterOptionsResolver} from "../resolvers/virtual-games-filter-options.resolver";

const routes: Routes = [

  {
    path: '',
    component: ReportsComponent,
    children: [
      {
        path: 'report-by-bet',
        loadChildren: () => import('./report-by-bet/report-by-bet.module').then(m => m.ReportByBetModule),
        resolve:{filterData:VirtualGamesFilterOptionsResolver},
      },
      {
        path: 'results',
        loadChildren: () => import('./results/results.module').then(m => m.ResultsModule),
        resolve:{filterData:VirtualGamesFilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'report-by-bet',
        pathMatch:'full'
      }
    ]
  },
  ]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
