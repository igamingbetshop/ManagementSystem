import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {BusinessAuditComponent} from "./business-audit.component";
import {FilterOptionsResolver} from "../../resolvers/filter-options.resolver";

const routes: Routes = [

  {
    path: '',
    component: BusinessAuditComponent,
    resolve: {filterData: FilterOptionsResolver},
    children: [
      {
        path: 'report-by-user-logs',
        loadChildren: () => import('./report-by-user-logs/report-by-user-logs').then(m => m.ReportByUserLogs),
      },
      {
        path: 'report-by-sessions',
        loadChildren: () => import('./report-by-sessions/report-by-sessions.module').then(m => m.ReportBySessionsModule),
      },
      {
        path: 'report-by-logs',
        loadChildren: () => import('./report-by-logs/report-by-logs.module').then(m => m.ReportByLogsModule),
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BusinessAuditRoutingModule {

}
