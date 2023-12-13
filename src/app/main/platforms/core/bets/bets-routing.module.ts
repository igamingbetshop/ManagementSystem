import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ClientCategoryResolver, CommonDataResolver, FilterOptionsResolver } from 'src/app/core/services';
import { BetsComponent } from './bets.component';
import { DocumentTypesResolver } from '../resolvers/document-types.resolver';



const routes: Routes = [

  {
    path:'',
    component: BetsComponent,
    children:[
      {
        path: 'internet',
        loadChildren: () => import('./internet/internet.module').then(m => m.InternetModule),
        resolve:{filterData:FilterOptionsResolver, commonData:CommonDataResolver,
          documentTypes:DocumentTypesResolver,
          clientCategories:ClientCategoryResolver},
      },
      {
        path: 'bet-bet-shops',
        loadChildren: () => import('./bet-bet-shops/bet-bet-shops.module').then(m => m.BetBetShopsModule),
        resolve:{filterData:FilterOptionsResolver, commonData:CommonDataResolver,},
      },


      {
        path: '',
        redirectTo: 'internet',
        pathMatch:'full'
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BetsRoutingModule
{

}
