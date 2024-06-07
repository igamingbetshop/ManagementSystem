import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import { CompetitionCategoryComponent } from './competition-category.component';


const routes: Routes = [
  {
    path:'',
    component:CompetitionCategoryComponent,
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
          path: 'competitions',
          loadChildren:() => import('./tabs/competitions/competitions.module').then(m => m.CompetitionsModule,),
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
export class CompetitionCategoryRoutingModule
{

}
