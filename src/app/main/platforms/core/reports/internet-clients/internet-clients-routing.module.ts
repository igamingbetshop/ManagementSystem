import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { InternetClientsComponent } from "./internet-clients.component";
import { FilterOptionsResolver } from "../../resolvers/filter-options.resolver";

const routes: Routes = [

  {
    path: '',
    component: InternetClientsComponent,
    resolve: { filterData: FilterOptionsResolver },
    children: [
      {
        path: 'report-by-bets',
        loadChildren: () => import('./report-by-bets/report-by-bets.module').then(m => m.ReportByBetsModule),
      },
      {
        path: 'report-by-bets/:gameId',
        loadChildren: () => import('./report-by-bets/report-by-bets.module').then(m => m.ReportByBetsModule),
      },
      {
        path: 'report-by-games',
        loadChildren: () => import('./report-by-games/report-by-games.module').then(m => m.ReportByGamesModule),
      },
      {
        path: 'report-by-providers',
        loadChildren: () => import('./report-by-providers/report-by-providers.module').then(m => m.ReportByProvidersModule),
      },
      {
        path: 'report-by-deposit',
        loadChildren: () => import('./report-by-deposit/report-by-deposit.module').then(m => m.ReportByDepositModule),
      },
      {
        path: 'report-by-withdrawal',
        loadChildren: () => import('./report-by-withdrawal/report-by-withdrawal.module').then(m => m.ReportByWithdrawalModule),
      },
      {
        path: 'report-by-client',
        loadChildren: () => import('./report-by-client/report-by-client.module').then(m => m.ReportByClientModule),
      },
      {
        path: 'report-by-client-exclusions',
        loadChildren: () => import('./report-by-client-exclusions/report-by-client-exclusions.module').then(m => m.ReportByClientExclusionsModule),
      },
      {
        path: 'report-by-bonuses',
        loadChildren: () => import('./report-by-bonus-details/report-by-bonus-details.module').then(m => m.ReportByBonusDetailsModule),
      },
      {
        path: 'report-by-client-changes',
        loadChildren: () => import('./report-by-client-changes/report-by-client-changes.module').then(m => m.ReportByClientChangesModule),
      },
      {
        path: 'report-by-documents',
        loadChildren: () => import('./report-by-documents/report-by-documents.module').then(m => m.ReportByDocumentsModule),
      },
      {
        path: 'report-by-client-duplicates',
        loadChildren: () => import('./report-by-client-duplicates/report-by-client-duplicates.module').then(m => m.ReportByDuplicates),      },
      {
        path: 'report-by-client-games',
        loadChildren: () => import('./report-by-client-games/report-by-client-games.module').then(m => m.ReportByClientGamesModule),
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
export class InternetClientsRoutingModule {

}
