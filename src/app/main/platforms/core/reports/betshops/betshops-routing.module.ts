import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {BetshopsComponent} from "./betshops.component";
import {FilterOptionsResolver} from "../../resolvers/filter-options.resolver";

const routes: Routes = [

  {
    path: '',
    component: BetshopsComponent,
    children: [
      {
        path: 'report-by-bets',
        loadChildren: () => import('./report-by-bets/report-by-bets.module').then(m => m.ReportByBetsModule),
        resolve: {filterData: FilterOptionsResolver},
      },
      {
        path: 'report-by-payments',
        loadChildren: () => import('./report-by-payments/report-by-payments.module').then(m => m.ReportByPaymentsModule),
        resolve: {filterData: FilterOptionsResolver},
      },
      {
        path: 'report-by-shifts',
        loadChildren: () => import('./report-by-shifts/report-by-shifts.module').then(m => m.ReportByShiftsModule),
        resolve: {filterData: FilterOptionsResolver},
      },
      {
        path: 'report-by-betshops',
        loadChildren: () => import('./report-by-betshops/report-by-betshops.module').then(m => m.ReportByBetshopsModule),
        resolve: {filterData: FilterOptionsResolver},
      },
      {
        path: 'report-by-betshop-game',
        loadChildren: () => import('./report-by-betshop-game/report-by-betshop-game.module').then(m => m.ReportByBetshopGameModule),
        resolve: {filterData: FilterOptionsResolver},
      },
      {
        path: '',
        redirectTo: 'report-by-bets',
        pathMatch: 'full'
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BetshopsRoutingModule {

}
