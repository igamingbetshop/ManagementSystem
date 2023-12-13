import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {SkillGamesFilterOptionsResolver} from "../resolvers/skill-games-filter-options.resolver";
import { CashTableComponent } from "./cash-table.component";

const routes: Routes = [

  {
    path: '',
    component: CashTableComponent,
    children: [
      {
        path: 'active-cash-tables',
        loadChildren: () => import('./active-cash-tables/active-cash-tables.module').then(m => m.ActiveCashTablesModule),
      },
      {
        path: 'finished-cash-tables',
        loadChildren: () => import('./finished-cash-tables/finished-cash-tables.module').then(m => m.FinishedCashTablesModule),
      },
      {
        path: '',
        redirectTo: 'active-tournaments',
        pathMatch: 'full'
      }
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CashTableRoutingModule {
}
