import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { UsersComponent } from "./users.component";
import { FilterOptionsResolver } from "../../resolvers/filter-options.resolver";

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    children: [
      {
        path: 'report-by-user-transactions',
        loadChildren: () => import('./report-by-user-transactions/report-by-user-transactions.module').then(m => m.ReportByUserTransactionsModule),
        resolve: { filterData: FilterOptionsResolver },
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRouting {

}
