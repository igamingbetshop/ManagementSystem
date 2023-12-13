import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {CompetitionComponent } from './competition.component';




const routes: Routes = [
  {
    path:'',
    component:CompetitionComponent,
    children:
      [
        {
          path: 'main',
          loadChildren:() => import('./tabs/main/main.module').then(m => m.MainModule),

        },
        {
          path: 'markets',
          loadChildren:() => import('./tabs/markets/markets.module').then(m => m.MarketsModule),

        },



        {
          path: '',
          redirectTo: 'main',
          pathMatch:'full'
        }
      ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompetitionRoutingModule
{

}
