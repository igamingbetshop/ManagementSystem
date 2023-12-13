import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ReportsComponent} from "./reports.component";
import {SkillGamesFilterOptionsResolver} from "../resolvers/skill-games-filter-options.resolver";

const routes: Routes = [

  {
    path: '',
    component: ReportsComponent,
    children: [
      {
        path: 'report-by-log',
        loadChildren: () => import('./report-by-bet/report-by-log.module').then(m => m.ReportByLogModule),
        resolve: {filterData: SkillGamesFilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'report-by-bet',
        pathMatch: 'full'
      }
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {
}
