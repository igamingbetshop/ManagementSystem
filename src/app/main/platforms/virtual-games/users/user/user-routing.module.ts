import {RouterModule, Routes} from "@angular/router";
import {UserComponent} from "./user.component";
import {NgModule} from "@angular/core";


const routes: Routes = [
  {
    path: '',
    component: UserComponent,
    children: [
      {
        path: '',
        redirectTo: 'main',
        pathMatch: 'full'
      },
      {
        path: 'main',
        loadChildren: () => import('./tabs/main/main.module').then(m => m.MainModule),
      },
      {
        path: 'markets',
        loadChildren: () => import('./tabs/markets/markets.module').then(m => m.MarketsModule),
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {

}
